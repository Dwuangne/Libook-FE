import React, { useState, useEffect } from 'react';
import { IconButton, Box, Typography, Paper } from '@mui/material';
import { Close, Send, ChatBubbleOutline } from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";

import { GetConversationByUserIdApi, GetConversationByIdApi } from "../../api/ConversationApi";

const MAX_MESSAGE_LENGTH = 34;

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
  }
};

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [participantMap, setParticipantMap] = useState({});
  const [messages, setMessages] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem("username");
  const accessToken = localStorage.getItem("accessToken");
  let userId = null; // Sửa thành let để có thể gán lại giá trị

  if (accessToken && typeof accessToken === "string") {
    try {
      const decodedAccessToken = jwtDecode(accessToken);
      console.log("Decoded Access Token:", decodedAccessToken);
      userId = decodedAccessToken.id;  // Gán giá trị cho userId
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  } else {
    console.warn("Invalid token specified: must be a string");
  }

  const fetchData = async () => {
    try {
      console.log(userId)
      const conversationsRes = await GetConversationByUserIdApi(userId);
      const conversationsData = conversationsRes?.data?.data || [];

      setConversation(conversationsData);

      console.log("Conversations:", conversationsData);

      // Tạo participantMap với mỗi conversationId và danh sách participants
      const participantMap = conversationsData.reduce((acc, conversation) => {
        acc[conversation.id] = {};
        conversation.participants.forEach(participant => {
          acc[conversation.id][participant.userId] = participant.username;
        });
        return acc;
      }, {});
      setParticipantMap(participantMap);

      // Hiển thị tên khi load trang (hội thoại đầu tiên)
      if (conversationsData.length > 0) {
        handleSelectConversation(conversationsData[0].id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchConversationById = async (conversationId) => {
    try {
      const conversationRes = await GetConversationByIdApi(conversationId);
      const conversationData = conversationRes?.data?.data || [];
      setMessages(conversationData.messages);
    } catch (err) {
      console.error("Error fetching conversation by ID:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
    fetchConversationById(conversationId);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatMessage = (content) => {
    if (!content) return '';
  
    // Split content by words to avoid breaking words in the middle
    const words = content.split(' ');
  
    let formattedMessage = '';
    let currentLine = '';
  
    words.forEach((word) => {
      // Nếu thêm từ hiện tại vào dòng hiện tại mà vượt quá giới hạn thì xuống dòng
      if ((currentLine + word).length > MAX_MESSAGE_LENGTH) {
        formattedMessage += currentLine + '\n';
        currentLine = word + ' '; // Tạo dòng mới bắt đầu với từ hiện tại
      } else {
        currentLine += word + ' '; // Tiếp tục thêm từ vào dòng hiện tại
      }
    });
  
    // Add the remaining text from the current line
    formattedMessage += currentLine.trim(); 
  
    return formattedMessage;
  };

  const styles = {
    chatContainer: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    chatBox: {
      width: '300px',
      height: '400px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      display: isOpen ? 'flex' : 'none',
      flexDirection: 'column',
      marginBottom: '10px', // Add space between chat box and toggle button
    },
    chatHeader: {
      padding: '10px 15px',
      backgroundColor: theme.primary,
      color: 'white',
      borderRadius: '10px 10px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    chatContent: {
      flex: 1,
      overflowY: 'auto',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      backgroundColor: theme.background.light, // Add background color to chat content
    },
    chatFooter: {
      padding: '10px 15px',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    input: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #e0e0e0',
      borderRadius: '20px',
      marginRight: '8px',
      '&:focus': {
        outline: 'none',
        borderColor: theme.primary,
      },
    },
    toggleButton: {
      backgroundColor: theme.primary,
      color: 'white',
      width: '48px',
      height: '48px',
      '&:hover': {
        backgroundColor: '#2c387e',
      },
    },
    sendButton: {
      backgroundColor: "white",
      color: theme.primary,
      width: '48px',
      height: '48px',
      '&:hover': {
        backgroundColor: '#2c387e',
      },
    },
  };

  return (
    <div style={styles.chatContainer}>
      {isOpen && (
        <div style={styles.chatBox}>
          <div style={styles.chatHeader}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Chat with Us
            </Typography>
            <IconButton onClick={toggleChat} sx={{ color: 'white', p: 0.5 }}>
              <Close />
            </IconButton>
          </div>

          <div style={styles.chatContent}>
            {selectedConversation && messages.length > 0 ? (
              messages.map((msg, index) => {
                const isCurrentUser = participantMap[selectedConversation][msg.userId] === username;
                return (
                  <Box key={index} sx={{
                    alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                  }}>
                    <Paper sx={{
                      p: 1.5,
                      backgroundColor: isCurrentUser ? theme.primary : 'white',
                      color: isCurrentUser ? 'white' : theme.text.primary,
                      borderRadius: isCurrentUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
                      wordBreak: 'break-word',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}>
                      <Typography variant="body2" sx={{ textAlign: "left" }}>
                        {formatMessage(msg.content)}
                      </Typography>
                    </Paper>
                  </Box>
                );
              })
            ) : (
              <Typography variant="body2" sx={{ color: theme.text.secondary, textAlign: 'center' }}>
                Welcome to our chat! How can we help you today?
              </Typography>
            )}
          </div>

          <div style={styles.chatFooter}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.input}
            />
            <IconButton style={styles.sendButton} onClick={() => {/* handleSendMessage */}}>
              <Send />
            </IconButton>
          </div>
        </div>
      )}

      <IconButton
        style={styles.toggleButton}
        onClick={toggleChat}
      >
        <ChatBubbleOutline />
      </IconButton>
    </div>
  );
};

export default ChatBox;