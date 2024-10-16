import React, { useState, useEffect, useCallback, useRef } from "react";
// import { HubConnectionBuilder } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import {
  Box,
  List,
  ListItem,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Send as SendIcon, Person as PersonIcon } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";

import {
  GetAllConversationsApi,
  GetConversationByIdApi,
} from "../../api/ConversationApi";
import { GetMessageByConversationIdApi } from "../../api/MessageApi";

const MAX_MESSAGE_LENGTH = 100;
const pageSize = 20;

// Theme colors
const theme = {
  primary: "#3F51B5",
  secondary: "#F5F5F5",
  accent: "#E3F2FD",
  text: {
    primary: "#333333",
    secondary: "#666666",
  },
  background: {
    main: "white",
    light: "#F5F7FF",
  },
};

export default function MessagesManagement() {
  // State management
  const [connection, setConnection] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // For loading more messages
  const [ignoreScrollToBottom, setIgnoreScrollToBottom] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);

  // Refs
  const messageContainerRef = useRef(null);
  const username = localStorage.getItem("username");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken && typeof accessToken === "string") {
      try {
        const decodedAccessToken = jwtDecode(accessToken);
        setUserId(decodedAccessToken.id);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to decode token:", error);
        setIsLoggedIn(false);
      }
    } else {
      console.warn("Invalid token specified: must be a string");
      setIsLoggedIn(false);
    }
  }, [accessToken]);

  const fetchData = useCallback(async () => {
    try {
      const conversationsRes = await GetAllConversationsApi();
      const conversationsData = conversationsRes?.data?.data || [];
      setConversations(conversationsData);

      if (conversationsData.length > 0 && !selectedConversationId) {
        handleSelectConversation(conversationsData[0].id);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  }, [selectedConversationId]);

  const fetchConversationById = useCallback(
    async (
      conversationId,
      isAppending = false,
      currentPageIndex = pageIndex
    ) => {
      if (loadingMore || !hasMoreMessages) return;

      const messageContainer = messageContainerRef.current;
      const currentScrollHeight = messageContainer
        ? messageContainer.scrollHeight
        : 0;

      setLoadingMore(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const [conversationRes, messageRes] = await Promise.all([
          GetConversationByIdApi(conversationId),
          GetMessageByConversationIdApi(
            conversationId,
            currentPageIndex,
            pageSize
          ),
        ]);

        const conversationData = conversationRes?.data?.data || {};
        const messageData = messageRes?.data?.data || {};

        setSelectedConversation(conversationData);
        if (messageData.length < pageSize) {
          setHasMoreMessages(false); // No more messages to load
        }

        if (isAppending) {
          setIgnoreScrollToBottom(true);
          setPreviousScrollHeight(currentScrollHeight);
          setMessages((prevMessages) => [
            ...messageData.reverse(),
            ...prevMessages,
          ]);
        } else {
          setIgnoreScrollToBottom(false);
          setMessages(messageData.reverse());
        }
      } catch (err) {
        console.error("Error fetching conversation by ID:", err);
      } finally {
        setLoadingMore(false); // Reset loading indicator
      }
    },
    [pageIndex, hasMoreMessages, loadingMore]
  );

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      fetchData().finally(() =>
        setTimeout(() => {
          setLoading(true);
        }, 1000)
      );
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const setupSignalRConnection = async () => {
      try {
        if (connection) {
          return;
        }

        const newConnection = new signalR.HubConnectionBuilder()
          .withUrl(
            "https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/chathub"
          )
          .withAutomaticReconnect()
          .build();

        await newConnection.start();

        newConnection.on("ReceiveSpecificMessage", (message) => {
          setIgnoreScrollToBottom(false);
          setSelectedConversationId((prevSelectedConversation) => {
            // Kiểm tra xem tin nhắn có thuộc cuộc trò chuyện đang chọn không
            if (message.conversationId === prevSelectedConversation) {
              setMessages((prevMessages) => [...prevMessages, message]);
            }

            setConversations((prevConversations) => {
              const conversationIndex = prevConversations.findIndex(
                (conv) => conv.id === message.conversationId
              );

              if (conversationIndex !== -1) {
                const updatedConversations = [...prevConversations];
                const [movedConversation] = updatedConversations.splice(
                  conversationIndex,
                  1
                );
                return [movedConversation, ...updatedConversations];
              }

              return prevConversations;
            });

            return prevSelectedConversation; // Return giá trị của selectedConversation mà không thay đổi
          });
        });

        newConnection.on("NotifyConversationCreatedToAdmin", (conversation) => {
          setConversations((prevConversations) => {
            // Kiểm tra xem cuộc trò chuyện đã có trong danh sách chưa
            const conversationExists = prevConversations.some(
              (conv) => conv.id === conversation.id
            );

            if (!conversationExists) {
              // Đưa cuộc trò chuyện mới lên đầu
              return [conversation, ...prevConversations];
            }

            return prevConversations;
          });
          // fetchData();
        });

        setConnection(newConnection);
      } catch (err) {
        console.error("SignalR connection error: ", err);
      }
    };

    setupSignalRConnection();
    return () => {
      if (connection) {
        connection
          .stop()
          .then(() => console.log("SignalR connection stopped."))
          .catch((err) =>
            console.error("Error stopping SignalR connection: ", err)
          );
      }
    };
  }, []);

  useEffect(() => {
    const joinConversations = async () => {
      if (!connection || !conversations.length) return;

      const joinedGroups = new Set();
      for (const conversation of conversations) {
        if (!joinedGroups.has(conversation.id)) {
          try {
            await connection.invoke("JoinConversation", conversation.id);
            joinedGroups.add(conversation.id);
          } catch (err) {
            console.error(
              `Error joining conversation ${conversation.id}:`,
              err
            );
          }
        }
      }
    };

    joinConversations();
  }, [conversations, connection]); // Theo dõi cả conversations và connection

  const handleScroll = () => {
    const messageContainer = messageContainerRef.current;
    if (
      messageContainer &&
      messageContainer.scrollTop <= 10 &&
      hasMoreMessages &&
      !loadingMore
    ) {
      setPageIndex((prevPageIndex) => {
        const newPageIndex = prevPageIndex + 1;
        fetchConversationById(selectedConversationId, true, newPageIndex); // Truyền pageIndex mới vào hàm
        return newPageIndex;
      });
    }
  };

  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      messageContainer.addEventListener("scroll", handleScroll);
      return () => {
        messageContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [selectedConversation, handleScroll]);

  useEffect(() => {
    const messageContainer = messageContainerRef.current;

    if (!ignoreScrollToBottom && messageContainer) {
      scrollToBottom();
    } else if (ignoreScrollToBottom && messageContainer) {
      setTimeout(() => {
        const newScrollHeight = messageContainer.scrollHeight;
        const scrollOffset = newScrollHeight - previousScrollHeight;
        messageContainer.scrollTop += scrollOffset + 10;
      }, 0);
    }
  }, [messages, ignoreScrollToBottom, previousScrollHeight]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  const handleSelectConversation = useCallback(
    (conversationId) => {
      setSelectedConversationId(conversationId);
      setPageIndex(1);
      setHasMoreMessages(true);
      fetchConversationById(conversationId);
    },
    [fetchConversationById]
  );

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || !connection) return;
    if (connection.state !== signalR.HubConnectionState.Connected) {
      console.error(
        "Cannot send message: Connection is not in 'Connected' state."
      );
      return;
    }
    try {
      if (!selectedConversationId) {
        await connection.invoke("StartConversation", userId, trimmedInput);
      } else {
        await connection.invoke(
          "SendMessage",
          selectedConversationId,
          trimmedInput,
          userId
        );
      }
      setInput("");
    } catch (err) {
      console.log("Error sending message: ", err);
    }
  };
  const formatMessage = (content) => {
    if (!content) return "";

    // Split content by words to avoid breaking words in the middle
    const words = content.split(" ");

    let formattedMessage = "";
    let currentLine = "";

    words.forEach((word) => {
      // Nếu thêm từ hiện tại vào dòng hiện tại mà vượt quá giới hạn thì xuống dòng
      if ((currentLine + word).length > MAX_MESSAGE_LENGTH) {
        formattedMessage += currentLine + "\n";
        currentLine = word + " "; // Tạo dòng mới bắt đầu với từ hiện tại
      } else {
        currentLine += word + " "; // Tiếp tục thêm từ vào dòng hiện tại
      }
    });

    // Add the remaining text from the current line
    formattedMessage += currentLine.trim();

    return formattedMessage;
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        backgroundColor: theme.background.main,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 30px",
          borderBottom: `2px solid ${theme.secondary}`,
          backgroundColor: theme.background.main,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: "600",
            color: theme.primary,
          }}
        >
          Messages
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 70px)",
          backgroundColor: theme.background.light,
          padding: "20px",
          gap: "20px",
        }}
      >
        <Paper
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            overflow: "hidden",
            borderBottom: `1px solid #e0e0e0`,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid #e0e0e0`,
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              sx={{
                backgroundColor: theme.primary,
                color: "white",
                marginRight: 2,
              }}
            >
              <PersonIcon />
            </IconButton>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: "500",
                color: theme.text.primary,
              }}
            >
              {selectedConversation &&
              selectedConversation.participants.length > 0
                ? selectedConversation.participants
                    .filter((participant) => participant.username !== username)
                    .map((participant) => participant.username) // Lấy username
                    .join(", ")
                : "Select Conversation"}
            </Typography>
          </Box>

          {loadingMore && (
            <Paper
              elevation={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                p: 1.5,
                backgroundColor: "background.paper",
                borderRadius: 1,
              }}
            >
              <CircularProgress size={20} color="primary" />
              <Typography
                variant="body2"
                fontWeight="medium"
                color="text.secondary"
              >
                Loading messages...
              </Typography>
            </Paper>
          )}
          <Box
            ref={messageContainerRef}
            sx={{
              flex: 1,
              overflow: "auto",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: "#f5f7ff",
            }}
          >
            {selectedConversation && messages.length > 0 ? (
              messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    alignSelf:
                      msg.userId === userId ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      backgroundColor:
                        msg.userId === userId
                          ? theme.primary
                          : theme.background.main,
                      color:
                        msg.userId === userId ? "white" : theme.text.primary,
                      borderRadius:
                        msg.userId === userId
                          ? "20px 20px 0 20px"
                          : "20px 20px 20px 0",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography variant="body1" sx={{ textAlign: "left" }}>
                      {formatMessage(msg.content)}
                    </Typography>
                  </Paper>
                </Box>
              ))
            ) : (
              <Typography
                variant="body1"
                sx={{ color: theme.text.secondary, textAlign: "center" }}
              >
                Select a conversation to start messaging
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: `1px solid #e0e0e0`,
              display: "flex",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(); // Gọi hàm gửi tin nhắn khi nhấn Enter
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  "& fieldset": {
                    borderColor: theme.secondary,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.primary,
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              sx={{
                borderRadius: "20px",
                minWidth: "auto",
                px: 3,
                backgroundColor: theme.primary,
                "&:hover": {
                  backgroundColor: `${theme.primary}CC`,
                },
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Paper>

        <Paper
          sx={{
            width: 320,
            overflow: "hidden",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            sx={{
              p: 2,
              fontSize: 18,
              fontWeight: "500",
              color: theme.text.primary,
              borderBottom: `1px solid ${theme.secondary}`,
            }}
          >
            Conversations
          </Typography>
          <List sx={{ overflow: "auto", maxHeight: "calc(100vh - 180px)" }}>
            {conversations.map((conversation) => (
              <ListItem
                key={conversation.id}
                button={true.toString()}
                selected={selectedConversationId === conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: theme.accent,
                    "&:hover": {
                      backgroundColor: theme.accent,
                    },
                  },
                  "&:hover": {
                    backgroundColor: `${theme.accent}80`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <IconButton
                    sx={{
                      backgroundColor: theme.primary,
                      color: "white",
                      marginRight: 2,
                    }}
                  >
                    <PersonIcon />
                  </IconButton>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: "500",
                        color: theme.text.primary,
                      }}
                    >
                      {conversation && conversation.participants.length > 0
                        ? conversation.participants
                            .filter(
                              (participant) => participant.username !== username
                            )
                            .map((participant) => participant.username) // Lấy username
                            .join(", ")
                        : "New Conversation"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.text.secondary,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {conversation.lastMessage}
                    </Typography>
                  </Box>
                  {conversation.unread > 0 && (
                    <Box
                      sx={{
                        backgroundColor: theme.primary,
                        color: "white",
                        borderRadius: "50%",
                        minWidth: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                      }}
                    >
                      {conversation.unread}
                    </Box>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}
