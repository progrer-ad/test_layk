import React, { useState } from 'react';
import {
  Paper,
  IconButton,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { AttachFile, Send, EmojiEmotions } from '@mui/icons-material';
import StickerPicker from './StickerPicker';

export default function MessageInput({
  handleSendMessage,
  newMessageContent,
  setNewMessageContent,
  newFile,
  setNewFile,
  fileInputRef
}) {
  const [showStickers, setShowStickers] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
    }
  };

  const handleSelectSticker = (emoji) => {
    setNewMessageContent((prev) => prev + emoji);
    setShowStickers(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessageContent.trim() || newFile) {
      handleSendMessage(e);
    }
  };

  return (
    <>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderTop: '1px solid #1e293b',
          bgcolor: '#1e293b',
          borderRadius: 0
        }}
        square
      >
        {/* Emoji */}
        <IconButton onClick={() => setShowStickers((prev) => !prev)}>
          <EmojiEmotions sx={{ color: '#facc15' }} />
        </IconButton>

        {/* File input */}
        <IconButton component="label">
          <AttachFile sx={{ color: '#60a5fa' }} />
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </IconButton>

        {/* File name preview */}
        {newFile && (
          <Typography
            variant="body2"
            sx={{
              color: '#e0e0e0',
              mr: 1,
              maxWidth: 140,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {newFile.name}
          </Typography>
        )}

        {/* Message input */}
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={newMessageContent}
          onChange={(e) => setNewMessageContent(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              bgcolor: '#0f172a',
              color: '#fff',
              px: 2
            },
            '& input': {
              color: '#fff'
            }
          }}
        />

        {/* Send button */}
        <IconButton
          type="submit"
          disabled={!newMessageContent.trim() && !newFile}
          sx={{
            bgcolor: '#3b82f6',
            color: 'white',
            borderRadius: '50%',
            '&:hover': {
              bgcolor: '#2563eb'
            }
          }}
        >
          <Send />
        </IconButton>
      </Paper>

      {/* Sticker picker */}
      {showStickers && (
        <Box sx={{ position: 'absolute', bottom: 70, left: 16, zIndex: 10 }}>
          <StickerPicker onSelectSticker={handleSelectSticker} />
        </Box>
      )}
    </>
  );
}
