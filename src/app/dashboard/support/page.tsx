'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Box,
  Paper,
  Snackbar,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Fab,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { styled, keyframes } from '@mui/system';
import Link from 'next/link';

// Yangi importlar
import FavoriteIcon from '@mui/icons-material/Favorite';
import SecurityIcon from '@mui/icons-material/Security';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PublicIcon from '@mui/icons-material/Public';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard'; // DashboardIcon import qilindi

// Keyframe animatsiyalari
const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
  25% { transform: translateY(-10px) rotate(5deg); opacity: 1; }
  50% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
  75% { transform: translateY(-5px) rotate(-5deg); opacity: 0.9; }
  100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const confettiFall = keyframes`
  0% { transform: translateY(0) rotateZ(0deg) scale(1); opacity: 1; }
  100% { transform: translateY(200px) rotateZ(720deg) scale(0.5); opacity: 0; }
`;

const sparkleAnimation = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.5); opacity: 0; transform: translateY(-100px); }
`;

// "Orzu qilingan" UI uchun stilga ega komponentlar
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FFB6C1 0%, #E6E6FA 50%, #FFF0F5 100%)',
  borderRadius: '24px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
  padding: '48px 24px',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
}));

// Yordamchi interfeyslarni aniqlash
interface SparkleProps {
  top: number;
  left: number;
  delay: number;
  size: number;
}

// Konfetti uchun yangilangan interfeys
interface ConfettiProps {
  index: number;
  left: number;
}

// Sparkle komponenti, endi prop turlarini qabul qiladi
const FloatingSparkle = styled('span', {
  shouldForwardProp: (prop) => prop !== 'top' && prop !== 'left' && prop !== 'delay' && prop !== 'size',
})<SparkleProps>(({ top, left, delay, size }) => ({
  position: 'absolute',
  top: `${top}%`,
  left: `${left}%`,
  width: `${size}px`,
  height: `${size}px`,
  backgroundColor: '#FFD700', // Gold color
  borderRadius: '50%',
  opacity: 0,
  animation: `${sparkleAnimation} 3s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  boxShadow: '0 0 8px #FFD700',
}));


const ConfettiContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1000,
  pointerEvents: 'none',
});

// Konfetti komponenti, prop turlarini qabul qiladi
const ConfettiHeart = styled('span', {
  shouldForwardProp: (prop) => prop !== 'index' && prop !== 'left',
})<ConfettiProps>(({ index, left }) => ({
  position: 'absolute',
  width: '20px',
  height: '20px',
  backgroundColor: '#FF69B4',
  clipPath: 'path("M20,10 C20,15 15,20 10,20 C5,20 0,15 0,10 C0,5 5,0 10,0 C15,0 20,5 20,10")',
  animation: `${confettiFall} 3s ease-in-out`,
  animationDelay: `${index * 0.1}s`,
  left: `${left}%`, // Endi bu yerda `left` prop ishlatiladi
}));


// Foydalanuvchi ma'lumotlari uchun interfeys
interface UserData {
  id: string;
  name: string;
  email: string;
}

const MuiSupportPage = () => {
  // Foydalanuvchi ID va ma'lumotlari uchun state'lar
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    type: 'suggestion',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'warning' | 'error'>('success');
  const [chatOpen, setChatOpen] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  // Chat funksiyaligi va yuklanish holati uchun state
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Sparkle va confetti uchun tasodifiy xususiyatlarni saqlash
  const [sparkleProps, setSparkleProps] = useState<SparkleProps[]>([]);
  const [confettiProps, setConfettiProps] = useState<ConfettiProps[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock API URL. Amalda sizning Laravel API'ingizning URL manzili bo'ladi.
  const MOCK_API_URL = process.env.NEXT_PUBLIC_API_URL;

  // useRouter hook'ini simulyatsiya qilish, chunki u ushbu muhitda mavjud emas.
  const router = {
    push: (url: string) => {
      console.log(`Navigatsiya qilishga urinish: ${url}`);
      // Haqiqiy ilovada bu foydalanuvchini kirish sahifasiga yo'naltiradi.
    }
  };

  // Foydalanuvchi ma'lumotlarini API'dan olish funksiyasi
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');

    // Test uchun mock token saqlaymiz, haqiqiy ilovada uni avval foydalanuvchi kiritadi.
    if (!token) {
        localStorage.setItem('token', 'mock-auth-token-12345');
    }

    setLoading(true);
    setShowLoader(true);

    try {
      const response = await axios.get<UserData>(`${MOCK_API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      const apiUser = response.data;

      if (!apiUser) {
        throw new Error("Foydalanuvchi ma'lumotlari API'dan qaytarilmadi.");
      }

      setFormData(prevData => ({
        ...prevData,
        name: apiUser.name,
        email: apiUser.email,
      }));
      setUserId(apiUser.id);


    } catch (error) {
      setSnackbarMessage("Siz tizimga kirmagansiz. Iltimos, hisobingizga kiring.");
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      router.push('/login'); // Bu yerda foydalanuvchi kiritgan router.push chaqiriladi
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  }, []);

  useEffect(() => {
    // Generatsiya qilamiz sparkle va confetti prop'larini yuklanganda
    const newSparkleProps = [...Array(20)].map(() => ({
      top: Math.random() * 80 + 10,
      left: Math.random() * 80 + 10,
      delay: Math.random() * 3,
      size: Math.random() * 5 + 5,
    }));
    setSparkleProps(newSparkleProps);

    // Yangi konfetti prop'larini generatsiya qilish
    const newConfettiProps = [...Array(50)].map((_, i) => ({
      index: i,
      left: Math.random() * 100,
    }));
    setConfettiProps(newConfettiProps);

    // Yangi yuklash mantiqini chaqirish
    fetchUser();
  }, [fetchUser]);

  // Yangi xabar qo'shilganda suhbatni pastga aylantirish uchun useEffect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Chat tarixini yuklash uchun yangi useEffect. userId o'zgarganda ishga tushadi.
  useEffect(() => {
    // Faqat userId mavjud bo'lganda chat tarixini yuklaymiz
    if (userId) {
      const fetchChatHistory = async () => {
        setIsChatLoading(true);
        try {
          // Bu yerda sizning haqiqiy API endpointingiz bo'ladi, masalan: `/api/chat-history?userId=${userId}`
          // Mock API chaqiruvi
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockChatData = {
            messages: [
              { text: "Assalomu alaykum, qanday yordam bera olaman?", sender: "admin", createdAt: new Date().toISOString() },
            ]
          };
          setMessages(mockChatData.messages || []);
        } catch (error) {
          console.error("Chat tarixini yuklashda xato:", error);
        } finally {
          setIsChatLoading(false);
        }
      };
      fetchChatHistory();
    }
  }, [userId]); // userId ga bog'liq qilib qo'yildi

  const faqs = [
    {
      question: "Foydalanuvchi ma'lumotlarim xavfsizmi?",
      answer: "Ha, biz sizning ma'lumotlaringizni himoya qilish uchun ilg'or xavfsizlik choralaridan foydalanamiz. Barcha ma'lumotlar shifrlangan va xavfsiz serverlarda saqlanadi."
    },
    {
      question: "Parolni qanday tiklashim mumkin?",
      answer: "Hisobingizga kirish sahifasida 'Parolni unutdingizmi?' havolasini bosing va parolni tiklash uchun ko'rsatmalarga amal qiling."
    },
    {
      question: "Xizmat shartlarini qayerdan topishim mumkin?",
      answer: "Xizmat shartlarimizni ushbu saytning pastki qismidagi havolada topishingiz mumkin. Bu yerda bizning xizmatlarimizdan foydalanish qoidalari va shartlari batafsil tushuntirilgan."
    }
  ];

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Kontakt formasi yuborish uchun Mock API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Tarmoq kechikishini simulyatsiya qilish
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await fetch(`${MOCK_API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setConfettiTrigger(true);
        setTimeout(() => setConfettiTrigger(false), 3000);
        setSnackbarMessage("Xabaringiz qabul qilindi. Tez orada siz bilan bog'lanamiz!");
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setFormData(prevData => ({ ...prevData, message: '' }));
      } else {
        const errorData = await response.json();
        setSnackbarMessage("Xabarni yuborishda xato yuz berdi.");
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Formani yuborishda xato:", error);
      setSnackbarMessage("Xabarni yuborishda tarmoq xatosi yuz berdi.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Laravel API ga chat xabarlarini yuborish
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      user_id: userId,
      message: chatInput,
      sender: "user",
      text: chatInput, // Bu prop-ni ham qo'shamiz, shunda UI da render qilishda muammo bo'lmaydi
    };

    // Avval foydalanuvchi xabarini qo‘shamiz (UI da ko‘rsatish uchun)
    setMessages((prev) => [...prev, newMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: newMessage.user_id, // ✅ backend snake_case talab qiladi
          message: newMessage.text, // ✅ input emas, xabar obyektidan
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Xato:", errorData);
        setSnackbarMessage("Xabarni yuborishda xato yuz berdi.");
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const data = await response.json();

      // Agentning javobi
      const agentMessage = {
        user_id: userId,
        text: data.text, // Laravel `store()` dan keladigan javob
        sender: "admin",
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error("Server bilan ulanishda xato:", error);
      setSnackbarMessage("Xabarni yuborishda tarmoq xatosi yuz berdi.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #fce4ec 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      <Container component="main" maxWidth="md" sx={{ py: { xs: 2, md: 8 }, px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 4, md: 8 } }}>
          {/* Hero Section */}
          <HeroSection>
            {/* Sparkle animatsiyalari, endi state-ga asoslangan prop'lardan foydalanadi */}
            {sparkleProps.map((props, i) => (
              <FloatingSparkle
                key={i}
                top={props.top}
                left={props.left}
                delay={props.delay}
                size={props.size}
              />
            ))}
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ color: '#5e35b1', fontWeight: 'bold', animation: `${pulse} 2s infinite` }}
            >
              Yordam kerakmi? Biz siz uchun shu yerdamiz 💕
            </Typography>
            <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
              Tezda javob toping yoki biz bilan bevosita bog'laning.
            </Typography>
          </HeroSection>

          {/* Tez yordam pufakchalari bo'limi */}
          <Box sx={{ width: '100%', mt: { xs: 2, md: 4 } }}>
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, color: '#5e35b1', fontWeight: 'bold' }}>
              Tez yordam
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: { xs: 2, md: 4 },
              }}
            >
              {[
                { label: 'Profile Magic ✨', icon: <FavoriteIcon /> },
                { label: 'Love & Safety 🛡️', icon: <SecurityIcon /> },
                { label: 'Membership 💳', icon: <CreditCardIcon /> },
                { label: 'Everything Else ❓', icon: <PublicIcon /> },
              ].map((item, index) => (
                <Button
                  key={index}
                  variant="contained"
                  sx={{
                    borderRadius: '50px',
                    bgcolor: '#fff0f5',
                    color: '#c2993a',
                    p: { xs: 1.5, md: 2 },
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    '&:hover': {
                      bgcolor: '#fff',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s ease-in-out',
                    },
                    '& .MuiButton-startIcon': { mr: { xs: 1, md: 1.5 } },
                  }}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Qidiruv paneli bo'limi */}
          <Box
            sx={{
              width: '100%',
              p: { xs: 2, md: 4 },
              background: 'linear-gradient(45deg, #F0F8FF 30%, #E6E6FA 90%)',
              borderRadius: '24px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Sizga qanday yordam bera olamiz?"
              InputProps={{
                sx: {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent !important',
                  },
                },
              }}
            />
          </Box>

          {/* FAQ mo'jizalar mamlakati bo'limi */}
          <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, width: '100%', borderRadius: '24px', bgcolor: '#ffffff', border: '1px solid #e0e0e0' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#5e35b1', textAlign: 'center', mb: 3, fontWeight: 'bold' }}>
              Tez-tez beriladigan savollar
            </Typography>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleAccordionChange(`panel${index}`)}
                sx={{
                  bgcolor: '#f8f8f8',
                  color: '#2c3e50',
                  mb: 2,
                  borderRadius: '16px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  border: '1px solid #e0e0e0',
                  '&:hover': { bgcolor: '#e6e8eb', transition: 'background-color 0.3s ease' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#c2993a' }} />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1f2f52' }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>

          {/* Kontakt formasi bo'limi */}
          <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, width: '100%', borderRadius: '24px', bgcolor: '#ffffff', border: '1px solid #e0e0e0' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#5e35b1', textAlign: 'center', mb: 3, fontWeight: 'bold' }}>
              Biz bilan bog'laning
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: '#2c3e50', fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
                  Murojaat turi
                </FormLabel>
                <RadioGroup
                  row
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  sx={{ justifyContent: 'center' }}
                >
                  <FormControlLabel
                    value="suggestion"
                    control={<Radio sx={{ color: '#c2993a', '&.Mui-checked': { color: '#a52a2a' } }} />}
                    label="Taklif"
                  />
                  <FormControlLabel
                    value="complaint"
                    control={<Radio sx={{ color: '#c2993a', '&.Mui-checked': { color: '#a52a2a' } }} />}
                    label="Shikoyat"
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                fullWidth
                label="Ism"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                InputLabelProps={{ style: { color: '#7f8c8d' } }}
                InputProps={{ style: { color: '#2c3e50', borderRadius: '12px' } }}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(240,242,245,0.7)', border: 'none' } }}
              />
              <TextField
                fullWidth
                label="Elektron pochta manzili"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                variant="outlined"
                InputLabelProps={{ style: { color: '#7f8c8d' } }}
                InputProps={{ style: { color: '#2c3e50', borderRadius: '12px' } }}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(240,242,245,0.7)', border: 'none' } }}
              />
              <TextField
                fullWidth
                label="Xabar"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
                variant="outlined"
                InputLabelProps={{ style: { color: '#7f8c8d' } }}
                InputProps={{ style: { color: '#2c3e50', borderRadius: '12px' } }}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(240,242,245,0.7)', border: 'none' } }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #FFB6C1 30%, #c2993a 90%)',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  py: 1.5,
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(194, 153, 58, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #a52a2a 30%, #FFB6C1 90%)',
                    transform: 'scale(1.02)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                Sevgi bilan yuboring 💌
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Jonli qo'llab-quvvatlash vidjeti */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            zIndex: 999,
          }}
        >
          {chatOpen && (
            <Paper
              elevation={6}
              sx={{
                width: { xs: '90vw', sm: 350 },
                height: { xs: 450, sm: 500 },
                borderRadius: '16px',
                p: 2,
                mb: 2,
                bgcolor: '#fff',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out',
                transform: chatOpen ? 'scale(1)' : 'scale(0.8)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={() => setChatOpen(false)} sx={{ color: '#c2993a' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#5e35b1', fontWeight: 'bold' }}>
                  Qo'llab-quvvatlash Cupid
                </Typography>
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                  Salom! Men sizga yordam berish uchun shu yerdaman.
                </Typography>
              </Box>

              {/* Chat xabarlari ko'rsatish maydoni */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  bgcolor: '#f8f8f8',
                  borderRadius: '12px',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {isChatLoading && messages.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress sx={{ color: '#c2993a' }} />
                  </Box>
                ) : messages.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontStyle: 'italic', textAlign: 'center', mt: 4 }}>
                    Suhbatni boshlang...
                  </Typography>
                ) : (
                  messages.map((message, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          p: 1.5,
                          maxWidth: '75%',
                          borderRadius: '16px',
                          bgcolor: message.sender === 'user' ? '#fce4ec' : '#e3f2fd',
                          color: message.sender === 'user' ? '#a52a2a' : '#5e35b1',
                        }}
                      >
                        <Typography variant="body2">{message.text}</Typography>
                      </Paper>
                    </Box>
                  ))
                )}
                {/* Scroll qilish uchun ko'rinmas element */}
                <div ref={messagesEndRef} />
              </Box>

              {/* Chat kiritish formasi */}
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                sx={{ mt: 2, display: 'flex', gap: 1 }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Xabar yozing..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '24px', // Rounded corners for a softer look
                      backgroundColor: '#f5f5f5', // A light gray background
                      transition: 'box-shadow 0.3s ease-in-out',
                      '&.Mui-focused': {
                        boxShadow: '0 0 5px rgba(194, 153, 58, 0.5)', // Gold shadow on focus
                        backgroundColor: '#fff',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.1) !important', // Subtle border
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(194, 153, 58, 0.7) !important', // Gold border on hover
                      },
                    },
                  }}
                />
                <IconButton
                  type="submit"
                  color="primary"
                  disabled={!chatInput.trim()} // Disables button if input is empty
                  sx={{
                    color: '#fff',
                    bgcolor: '#c2993a', // Gold color for the button
                    borderRadius: '50%', // Circular button
                    boxShadow: '0 4px 10px rgba(194, 153, 58, 0.3)', // Soft shadow
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: '#a52a2a', // Darker color on hover
                      transform: 'scale(1.1)',
                      boxShadow: '0 6px 15px rgba(165, 42, 42, 0.4)',
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#e0e0e0', // Light gray when disabled
                      color: '#a0a0a0',
                      boxShadow: 'none',
                    },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Paper>
          )}

          {/* Chat tugmasi */}
          <Fab
            color="primary"
            aria-label="live support"
            onClick={() => setChatOpen(!chatOpen)}
            sx={{
              background: 'linear-gradient(45deg, #c2993a 30%, #FFB6C1 90%)',
              boxShadow: '0 4px 20px rgba(194, 153, 58, 0.3)',
              animation: `${pulse} 2s infinite`,
              '&:hover': {
                animation: 'none',
              },
            }}
          >
            <ChatBubbleOutlineIcon sx={{ color: '#fff' }} />
          </Fab>
          
          {/* Yangi: Dashboard tugmasi */}
         <Fab
    component={Link} // Use the Link component as the underlying component
    href="/dashboard" // Set the destination URL
    color="secondary"
    aria-label="dashboard"
    sx={{
        position: 'absolute',
        right: 0,
        bottom: 120,
        background: 'linear-gradient(45deg, #81c784 30%, #4caf50 90%)',
        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
        animation: `${float} 4s infinite`,
        '&:hover': {
            background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
        },
    }}
>
    <DashboardIcon sx={{ color: '#fff' }} />
</Fab>

        </Box>

        {/* Muvaffaqiyatli xabar ko'rsatish uchun Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{
              width: '100%',
              bgcolor: snackbarSeverity === 'success' ? '#c2993a' : '#a52a2a',
              color: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(194, 153, 58, 0.3)',
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Konfetti animatsiyasi, endi state-ga asoslangan prop'lardan foydalanadi */}
        {confettiTrigger && (
          <ConfettiContainer>
            {confettiProps.map((props, i) => (
              <ConfettiHeart key={i} index={props.index} left={props.left} />
            ))}
          </ConfettiContainer>
        )}
      </Container>
    </Box>
  );
};

export default MuiSupportPage;