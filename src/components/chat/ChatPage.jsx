'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Paper, Avatar, Typography, CircularProgress, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import axios from 'axios';

// Get the base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ChatPage({
    selectedChat,
    onBack,
    currentUserId,
    currentUserName,
    currentUserAvatar
}) {
    const [messages, setMessages] = useState([]);
    const [newMessageContent, setNewMessageContent] = useState('');
    const [newFile, setNewFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const chatId = selectedChat?.id;
    const partnerName = selectedChat?.partner_name || 'Suhbatdosh';
    const partnerAvatarPath = selectedChat?.partner_avatar;

    // Construct dynamic avatar URLs
    const partnerAvatar = partnerAvatarPath
        ? (partnerAvatarPath.startsWith('http')
            ? partnerAvatarPath
            : `${API_BASE_URL}/storage/${partnerAvatarPath}`)
        : `https://placehold.co/40x40/gray/fff?text=${partnerName.charAt(0)}`;

    const userAvatar = currentUserAvatar
        ? (currentUserAvatar.startsWith('http')
            ? currentUserAvatar
            : `${API_BASE_URL}/storage/${currentUserAvatar}`)
        : `https://placehold.co/40x40/007bff/fff?text=${currentUserName?.charAt(0)}`;

    const fetchMessages = useCallback(async () => {
        const token = localStorage.getItem('token');
        // Make sure API_BASE_URL is defined before making a request
        if (!chatId || !token || !API_BASE_URL) {
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/api/chats/${chatId}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error("Xabarlar yuklashda xato:", error);
        } finally {
            setLoading(false);
        }
    }, [chatId]);

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!chatId || (!newMessageContent.trim() && !newFile) || !token || !API_BASE_URL) return;

        const formData = new FormData();
        if (newMessageContent.trim()) formData.append('content', newMessageContent);
        if (newFile) formData.append('file', newFile);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/chats/${chatId}/messages`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessages(prev => [...prev, response.data.message]);
            setNewMessageContent('');
            setNewFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            console.error("Xabar yuborishda xato:", error);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#0f172a' }}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#1e293b', color: 'white' }}>
                <IconButton onClick={onBack} sx={{ color: 'white' }}><ArrowBack /></IconButton>
                <Avatar src={partnerAvatar} alt={partnerName}>{partnerName.charAt(0)}</Avatar>
                <Typography variant="h6">{partnerName}</Typography>
            </Paper>

            <Box
                sx={{
                    flexGrow: 1,
                    p: 2,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                {loading ? (
                    <CircularProgress />
                ) : (
                    messages.map(msg => (
                        <MessageItem
                            key={msg.id}
                            message={msg}
                            isOwn={msg.user_id === currentUserId}
                            currentUserName={currentUserName}
                            currentUserAvatar={userAvatar}
                            partnerName={partnerName}
                            partnerAvatar={partnerAvatar}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </Box>

            <MessageInput
                {...{
                    handleSendMessage,
                    newMessageContent,
                    setNewMessageContent,
                    newFile,
                    setNewFile,
                    fileInputRef
                }}
            />
        </Box>
    );
}