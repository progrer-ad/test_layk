import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Paper, Avatar, Typography, CircularProgress, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import axios from 'axios';

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

  const partnerAvatar = partnerAvatarPath
    ? (partnerAvatarPath.startsWith('http')
      ? partnerAvatarPath
      : `http://localhost:8000/storage/${partnerAvatarPath}`)
    : `https://placehold.co/40x40/gray/fff?text=${partnerName.charAt(0)}`;

  const userAvatar = currentUserAvatar
    ? (currentUserAvatar.startsWith('http')
      ? currentUserAvatar
      : `http://localhost:8000/storage/${currentUserAvatar}`)
    : `https://placehold.co/40x40/007bff/fff?text=${currentUserName?.charAt(0)}`;

  const fetchMessages = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!chatId || !token) return;
    try {
      const response = await axios.get(`/chats/${chatId}/messages`, {
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
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!chatId || (!newMessageContent.trim() && !newFile) || !token) return;

    const formData = new FormData();
    if (newMessageContent.trim()) formData.append('content', newMessageContent);
    if (newFile) formData.append('file', newFile);

    try {
      const response = await axios.post(`/chats/${chatId}/messages`, formData, {
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