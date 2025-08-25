// src/components/dashboard/ProfileCard.tsx
import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { keyframes } from '@emotion/react';

interface ProfileCardProps {
  id: number;
  name: string;
  age: number;
  status: string; // E.g., "Online", "2h ago"
  image: string;
  bio: string;
  onLike: (id: number) => void;
  onChat: (id: number) => void;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  name,
  age,
  status,
  image,
  bio,
  onLike,
  onChat,
}) => {
  const isOnline = status === 'Online';

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: '15px',
        overflow: 'hidden',
        position: 'relative',
        animation: `${fadeIn} 0.5s ease-out forwards`,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 25px rgba(0,0,0,0.1)',
        },
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 250,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          borderBottom: '1px solid #eee',
        }}
      >
        {isOnline && (
          <Chip
            label="Online"
            size="small"
            sx={{
              position: 'absolute',
              top: 15,
              right: 15,
              bgcolor: '#2ecc71', // Updated to a vibrant green
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '8px',
              px: 1,
              py: 0.5,
              animation: `${keyframes`
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
              `} 1.5s infinite ease-in-out`,
            }}
          />
        )}
        {!isOnline && status !== '' && (
          <Chip
            label={status}
            size="small"
            sx={{
              position: 'absolute',
              top: 15,
              right: 15,
              bgcolor: 'rgba(0,0,0,0.3)', // Slightly more subtle grey
              color: 'white',
              borderRadius: '8px',
              px: 1,
              py: 0.5,
            }}
          />
        )}
      </Box>
      <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 0.5 }}>
          {name}, {age}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left', fontSize: '0.9rem' }}>
          {bio}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto', width: '100%' }}>
          <Button
            variant="contained"
            startIcon={<FavoriteBorderIcon />}
            onClick={() => onLike(id)}
            sx={{
              flexGrow: 1,
              bgcolor: '#5e72e4', // Updated to a deep blue
              color: 'white',
              borderRadius: '10px',
              '&:hover': { bgcolor: '#4a549d' }, // Darker blue on hover
              fontWeight: 'bold',
              fontSize: '0.9rem',
              py: 1.2
            }}
          >
            Like
          </Button>
          <Button
            variant="outlined"
            startIcon={<ChatBubbleOutlineIcon />}
            onClick={() => onChat(id)}
            sx={{
              flexGrow: 1,
              borderColor: '#5e72e4', // Border color updated to blue
              color: '#5e72e4', // Text color updated to blue
              borderRadius: '10px',
              '&:hover': { bgcolor: '#e9ebf9' }, // Lighter blue background on hover
              fontWeight: 'bold',
              fontSize: '0.9rem',
              py: 1.2
            }}
          >
            Chat
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileCard;
