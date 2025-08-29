// components/ChatDashboard.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, Box } from '@mui/material';
import ChatList from './ChatList';
import ChatPage from './ChatPage';
import { customTheme } from "@/components/chat/theme";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function ChatDashboard() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState('Siz');
  const [currentUserAvatar, setCurrentUserAvatar] = useState('');

const fetchCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/user', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = response.data;

    // ✅ Konsolga foydalanuvchini chiqaramiz

    // To‘g‘ri avatar URL-ni yasab olish
    const avatarUrl = user.avatar_url
      ? user.avatar_url 
      : `https://placehold.co/40x40/007bff/ffffff?text=${user.name?.[0]?.toUpperCase() || 'U'}`;

    setCurrentUserId(user.id);
    setCurrentUserName(user.name);
    setCurrentUserAvatar(avatarUrl);
  } catch (error) {
    console.error('Foydalanuvchini olishda xatolik:', error);
  }
};



  const fetchChatList = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return setLoadingChats(false);

    try {
      const response = await axios.get('/chats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(response.data.chats || []);
    } catch (e) {
      console.error("Chatlar xatoligi:", e);
    } finally {
      setLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    axios.get('https://68ac5f519148d.xvest1.ru/sanctum/csrf-cookie');
    fetchCurrentUser();
    fetchChatList();
    const interval = setInterval(fetchChatList, 5000);
    return () => clearInterval(interval);
  }, [fetchChatList]);

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {selectedChat ? (
          <ChatPage selectedChat={selectedChat} onBack={() => setSelectedChat(null)} currentUserId={currentUserId} currentUserName={currentUserName} currentUserAvatar={currentUserAvatar} />
        ) : (
          <ChatList chats={chats} onSelectChat={setSelectedChat} loadingChats={loadingChats} />
        )}
      </Box>
    </ThemeProvider>
  );
}
