import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  IconButton,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { Close, Send, ChatBubbleOutline } from "@mui/icons-material";
// import { HubConnectionBuilder } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";

import { GetConversationByUserIdApi } from "../../api/ConversationApi";
import { GetMessageByConversationIdApi } from "../../api/MessageApi";

const MAX_MESSAGE_LENGTH = 34;
const pageSize = 20;

const theme = {
  primary: "#3F51B5",
  secondary: "#F5F5F5",
  accent: "#E3F2FD",
  text: {
    primary: "#333333",
    secondary: "#666666",
  },
  background: {
    main: "#f0f0f0",
    light: "#F5F7FF",
  },
};

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [connection, setConnection] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // For loading more messages
  const [ignoreScrollToBottom, setIgnoreScrollToBottom] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);

  const navigate = useNavigate();
  const messageContainerRef = useRef(null);
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
    if (!userId) {
      console.warn("UserId is not defined yet.");
      return;
    }

    try {
      const conversationsRes = await GetConversationByUserIdApi(userId);
      const conversationsData = conversationsRes?.data?.data || [];

      if (conversationsData.length > 0 && !selectedConversation) {
        handleSelectConversation(conversationsData[0].id);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  }, [userId, selectedConversation]);

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
        // Đợi 1 giây trước khi gọi API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const messageRes = await GetMessageByConversationIdApi(
          conversationId,
          currentPageIndex,
          pageSize
        );
        const messageData = messageRes?.data?.data || [];

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
  }, [isLoggedIn, fetchData]);

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
        fetchConversationById(selectedConversation, true, newPageIndex); // Truyền pageIndex mới vào hàm
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

        // Khi kết nối hoàn thành
        newConnection.on("ReceiveSpecificMessage", (message) => {
          setIgnoreScrollToBottom(false);
          setMessages((prevMessages) => [...prevMessages, message]);
        });

        newConnection.on(
          "NotifyConversationCreatedToCustomer",
          (conversation) => {
            setHasMoreMessages(false);
            setSelectedConversation(conversation.id);
            setMessages((prevMessages) => [
              ...prevMessages,
              conversation.messages[0],
            ]);
          }
        );

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
      if (!connection || !selectedConversation) return;

      // Chỉ tham gia cuộc trò chuyện nếu kết nối đã hoàn tất
      if (connection.state === signalR.HubConnectionState.Connected) {
        try {
          await connection.invoke("JoinConversation", selectedConversation);
        } catch (err) {
          console.error(
            `Error joining conversation ${selectedConversation}:`,
            err
          );
        }
      } else {
        console.warn("Cannot join conversation: connection not yet connected.");
      }
    };

    joinConversations();
  }, [selectedConversation, connection]);

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
  }, [messages, isOpen, ignoreScrollToBottom, previousScrollHeight]);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
    setPageIndex(1); // Reset page index when selecting a new conversation
    setHasMoreMessages(true); // Reset pagination flag
    fetchConversationById(conversationId);
  };

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    // Kiểm tra trạng thái kết nối
    if (!trimmedInput || !connection) return;
    if (connection.state !== signalR.HubConnectionState.Connected) {
      console.error(
        "Cannot send message: Connection is not in 'Connected' state."
      );
      return;
    }
    try {
      if (!selectedConversation) {
        await connection.invoke("StartConversation", userId, trimmedInput);
      } else {
        await connection.invoke(
          "SendMessage",
          selectedConversation,
          trimmedInput,
          userId
        );
      }
      setInput("");
    } catch (err) {
      console.log("Error sending message: ", err);
    }
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
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

  const styles = {
    chatContainer: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
    chatBox: {
      width: "300px",
      height: "400px",
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      display: isOpen ? "flex" : "none",
      flexDirection: "column",
      marginBottom: "10px", // Add space between chat box and toggle button
    },
    chatHeader: {
      padding: "10px 15px",
      backgroundColor: theme.primary,
      color: "white",
      borderRadius: "10px 10px 0 0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    chatContent: {
      flex: 1,
      overflowY: "auto",
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      backgroundColor: theme.background.light, // Add background color to chat content
    },
    chatFooter: {
      padding: "10px 15px",
      borderTop: "1px solid #e0e0e0",
      display: "flex",
      alignItems: "center",
      backgroundColor: "white",
    },
    input: {
      flex: 1,
      padding: "8px 12px",
      border: "1px solid #e0e0e0",
      borderRadius: "20px",
      marginRight: "8px",
      "&:focus": {
        outline: "none",
        borderColor: theme.primary,
      },
    },
    toggleButton: {
      backgroundColor: theme.primary,
      color: "white",
      width: "48px",
      height: "48px",
      "&:hover": {
        backgroundColor: "#2c387e",
      },
    },
    sendButton: {
      backgroundColor: "white",
      color: theme.primary,
      width: "48px",
      height: "48px",
      "&:hover": {
        backgroundColor: "#2c387e",
      },
    },
    loginButton: {
      width: "60%",
      backgroundColor: theme.primary,
      color: "white",
      borderRadius: "24px",
      padding: "10px 0",
      textTransform: "none",
      fontSize: "16px",
      fontWeight: 500,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      },
    },
  };

  if (
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/signin") ||
    location.pathname.startsWith("/signup")
  ) {
    return null;
  }
  return (
    <div style={styles.chatContainer}>
      {isOpen && (
        <div style={styles.chatBox}>
          <div style={styles.chatHeader}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Chat with Us
            </Typography>
            <IconButton onClick={toggleChat} sx={{ color: "white", p: 0.5 }}>
              <Close />
            </IconButton>
          </div>

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
          <Box style={styles.chatContent} ref={messageContainerRef}>
            {isLoggedIn ? (
              selectedConversation && messages.length > 0 ? (
                messages.map((msg, index) => {
                  const isCurrentUser = msg.userId === userId;
                  return (
                    <Box
                      key={index}
                      sx={{
                        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                        maxWidth: "80%",
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1.5,
                          backgroundColor: isCurrentUser
                            ? theme.primary
                            : "white",
                          color: isCurrentUser ? "white" : theme.text.primary,
                          borderRadius: isCurrentUser
                            ? "20px 20px 0 20px"
                            : "20px 20px 20px 0",
                          wordBreak: "break-word",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Typography variant="body2" sx={{ textAlign: "left" }}>
                          {formatMessage(msg.content)}
                        </Typography>
                      </Paper>
                    </Box>
                  );
                })
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.text.secondary,
                    textAlign: "center",
                    mt: 2,
                  }}
                >
                  👋 Welcome! How can we help you today?
                </Typography>
              )
            ) : (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: theme.text.primary }}
                >
                  Join the Conversation
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 3, color: theme.text.secondary }}
                >
                  Log in to start chatting with our team
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/signin")}
                  sx={styles.loginButton}
                >
                  Log In to Chat
                </Button>
              </Box>
            )}
          </Box>
          {isLoggedIn && (
            <div style={styles.chatFooter}>
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                style={styles.input}
              />
              <IconButton style={styles.sendButton} onClick={handleSendMessage}>
                <Send />
              </IconButton>
            </div>
          )}
        </div>
      )}

      <IconButton style={styles.toggleButton} onClick={toggleChat}>
        <ChatBubbleOutline />
      </IconButton>
    </div>
  );
};

export default ChatBox;
