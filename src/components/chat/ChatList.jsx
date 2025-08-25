'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
  Divider,
  Tooltip,
  Badge,
  InputBase
} from '@mui/material';

import { MessageCircle, RefreshCw, Search, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';

export default function ChatList({ chats, onSelectChat, loadingChats, onRefresh }) {
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = useMemo(() => {
    if (!Array.isArray(chats)) return [];
    return chats.filter(chat =>
      chat.partner_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, chats]);

  return (
    <Box sx={{ width: '100%', height: '100%', overflowY: 'auto', bgcolor: '#0f172a' }}>
      {/* Header */}
      <Paper
        component="header"
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b',
          borderRadius: 0,
          bgcolor: '#1e293b',
          boxShadow: 'none'
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Back to Dashboard">
            <IconButton onClick={() => router.push('/dashboard')} sx={{ color: 'white' }}>
              <ArrowLeft size={20} />
            </IconButton>
          </Tooltip>
          <MessageCircle size={22} color="#f8fafc" />
          <Typography variant="h6" color="white">
            Chats
          </Typography>
        </Box>

        <Tooltip title="Refresh">
          <IconButton onClick={onRefresh} size="small" sx={{ color: '#f1f5f9' }}>
            <RefreshCw size={20} />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Search */}
      <Paper
        elevation={0}
        sx={{
          mx: 2,
          my: 1,
          px: 2,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          borderRadius: '12px',
          bgcolor: '#1e293b',
          border: '1px solid #334155',
        }}
      >
        <Search size={18} style={{ marginRight: 8, color: '#cbd5e1' }} />
        <InputBase
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ fontSize: 14, color: 'white' }}
        />
      </Paper>

      {/* Chat List */}
      {loadingChats ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <List disablePadding>
          {filteredChats.length === 0 ? (
            <Typography variant="body2" align="center" sx={{ mt: 4, color: '#94a3b8' }}>
              No matching chats found
            </Typography>
          ) : (
            filteredChats.map((chat) => (
              <React.Fragment key={chat.id}>
                <ListItemButton
                  onClick={() => onSelectChat(chat)}
                  sx={{
                    '&:hover': { bgcolor: '#334155' },
                    px: 2,
                    py: 1.5,
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      color="error"
                      variant="dot"
                      invisible={!chat.unread_count}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      overlap="circular"
                    >
                      <Avatar
                        src={chat.partner_avatar}
                        alt={chat.partner_name}
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: theme.palette.secondary.main,
                          color: theme.palette.secondary.contrastText,
                          fontWeight: 'bold',
                        }}
                      >
                        {chat.partner_name?.charAt(0) || '?'}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ color: 'white' }}>
                        {chat.partner_name || 'Unknown'}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" noWrap sx={{ color: '#cbd5e1' }}>
                        {chat.last_message_content || 'Start the conversation...'}
                      </Typography>
                    }
                  />
                </ListItemButton>
                <Divider variant="inset" component="li" sx={{ ml: 9, borderColor: '#1e293b' }} />
              </React.Fragment>
            ))
          )}
        </List>
      )}
    </Box>
  );
}
