import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import { Box, List, ListItem, ListItemText, Typography, Paper, Divider, TextField, Button, IconButton } from '@mui/material';
import { Send as SendIcon, Person as PersonIcon } from '@mui/icons-material';

import { GetAllConversationsApi, GetConversationByIdApi } from "../../api/ConversationApi";

const MAX_MESSAGE_LENGTH = 100;

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
        main: "#f0f0f0",
        light: "#F5F7FF",
    }
};

export default function MessagesManagement() {
    const [connection, setConnection] = useState(null);
    const [chatroom, setChatRoom] = useState('');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const [conversations, setConversations] = useState([]);
    const [participantMap, setParticipantMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [displayedNames, setDisplayedNames] = useState('');

    const username = localStorage.getItem("username");
    const [selectedConversation, setSelectedConversation] = useState(null);

    const fetchData = async () => {
        try {
            const conversationsRes = await GetAllConversationsApi();
            const conversationsData = conversationsRes?.data?.data || [];
            setConversations(conversationsData);

            // Tạo participantMap với mỗi conversationId và danh sách participants
            const participantMap = conversationsData.reduce((acc, conversation) => {
                if (!acc[conversation.id]) {
                    acc[conversation.id] = {};
                }
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

    const handleSelectConversation = (conversationId) => {
        setSelectedConversation(conversationId);
        fetchConversationById(conversationId);
    };

    useEffect(() => {
        setLoading(true);
        fetchData().finally(() => setLoading(false));
    }, []);

    const joinChatRoom = async (username, chatRoom) => {
        try {
            const newConnection = new HubConnectionBuilder()
                .withUrl('https://localhost:7158/chathub')
                .configureLogging(signalR.LogLevel.Information)
                .build();

            newConnection.on("ReceiveSepecificMessage", (username, message) => {
                setMessages((prevMessages) => [...prevMessages, { username, message }]);
            });

            await newConnection.start();
            await newConnection.invoke("JoinSepecificChatRoom", { username, chatRoom });
            setConnection(newConnection);
        } catch (error) {
            console.error('Connection failed: ', error);
        }
    };

    const sendMessage = async () => {
        if (connection && input) {
            try {
                await connection.invoke("SendMessage", input);
                setInput('');
            } catch (error) {
                console.error('Message sending failed: ', error);
            }
        }
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

    return (
        <Box sx={{
            flexGrow: 1,
            minHeight: "100vh",
            backgroundColor: theme.background.main,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 30px',
                borderBottom: `2px solid ${theme.secondary}`,
                backgroundColor: theme.background.main,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}>
                <Typography sx={{
                    fontSize: 24,
                    fontWeight: '600',
                    color: theme.primary,
                }}>
                    Messages
                </Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                height: 'calc(100vh - 70px)',
                backgroundColor: theme.background.light,
                padding: '20px',
                gap: '20px',

            }}>
                <Paper sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    borderBottom: `1px solid #e0e0e0`,
                }}>
                    <Box sx={{
                        p: 2,
                        borderBottom: `1px solid #e0e0e0`,
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <IconButton sx={{
                            backgroundColor: theme.primary,
                            color: 'white',
                            marginRight: 2,
                        }}>
                            <PersonIcon />
                        </IconButton>
                        <Typography sx={{
                            fontSize: 18,
                            fontWeight: '500',
                            color: theme.text.primary,
                        }}>
                            {participantMap[selectedConversation] ? Object.values(participantMap[selectedConversation]).filter(name => name !== username).join(', ') : ''}
                        </Typography>
                    </Box>

                    <Box sx={{
                        flex: 1,
                        overflow: 'auto',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        backgroundColor: "#f5f7ff",

                    }}>
                        {selectedConversation && messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <Box key={index} sx={{
                                    alignSelf: participantMap[selectedConversation][msg.userId] === username ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                }}>
                                    <Paper sx={{
                                        p: 1.5,
                                        backgroundColor: participantMap[selectedConversation][msg.userId] === username ? theme.primary : theme.background.main,
                                        color: participantMap[selectedConversation][msg.userId] === username ? 'white' : theme.text.primary,
                                        borderRadius: participantMap[selectedConversation][msg.userId] === username ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    }}>
                                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                                            {formatMessage(msg.content)}
                                        </Typography>
                                    </Paper>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body1" sx={{ color: theme.text.secondary, textAlign: 'center' }}>
                                Select a conversation to start messaging
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{
                        p: 2,
                        borderTop: `1px solid #e0e0e0`,
                        display: 'flex',
                        gap: 2,
                    }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px',
                                    '& fieldset': {
                                        borderColor: theme.secondary,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.primary,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.primary,
                                    },
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={sendMessage}
                            sx={{
                                borderRadius: '20px',
                                minWidth: 'auto',
                                px: 3,
                                backgroundColor: theme.primary,
                                '&:hover': {
                                    backgroundColor: `${theme.primary}CC`,
                                },
                            }}
                        >
                            <SendIcon />
                        </Button>
                    </Box>
                </Paper>

                <Paper sx={{
                    width: 320,
                    overflow: 'hidden',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                    <Typography sx={{
                        p: 2,
                        fontSize: 18,
                        fontWeight: '500',
                        color: theme.text.primary,
                        borderBottom: `1px solid ${theme.secondary}`,
                    }}>
                        Conversations
                    </Typography>
                    <List sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
                        {conversations.map((conversation) => (
                            <ListItem
                                key={conversation.id}
                                button
                                selected={selectedConversation === conversation.id}
                                onClick={() => handleSelectConversation(conversation.id)}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: theme.accent,
                                        '&:hover': {
                                            backgroundColor: theme.accent,
                                        }
                                    },
                                    '&:hover': {
                                        backgroundColor: `${theme.accent}80`,
                                    }
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                }}>
                                    <IconButton sx={{
                                        backgroundColor: theme.primary,
                                        color: 'white',
                                        marginRight: 2,
                                    }}>
                                        <PersonIcon />
                                    </IconButton>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{
                                            fontWeight: '500',
                                            color: theme.text.primary,
                                        }}>
                                            {participantMap[conversation.id] ? Object.values(participantMap[conversation.id]).filter(name => name !== username).join(', ') : ''}
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: theme.text.secondary,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {conversation.lastMessage}
                                        </Typography>
                                    </Box>
                                    {conversation.unread > 0 && (
                                        <Box sx={{
                                            backgroundColor: theme.primary,
                                            color: 'white',
                                            borderRadius: '50%',
                                            minWidth: 24,
                                            height: 24,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 12,
                                        }}>
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
