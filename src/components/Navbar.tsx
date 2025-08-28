'use client';

import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Fade,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import { useI18n } from '@/context/I18nProvider'; // <-- import qilindi

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleDrawer = (open: boolean) => () => setOpenDrawer(open);

  const scrollToSection = (id: string) => {
    setOpenDrawer(false);
    requestAnimationFrame(() => {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    document.body.style.overflow = openDrawer ? 'hidden' : 'auto';
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, [openDrawer]);

  const { language, changeLanguage } = useI18n(); // <-- useI18n hooki ishlatiladi

const menuItems = [
  { 
    label: 
      language === 'en' ? 'Home' :
      language === 'ru' ? 'Главная' :
      language === 'zh' ? '首页' :
      language === 'es' ? 'Inicio' :
      language === 'hi' ? 'मुखपृष्ठ' :
      'الرئيسية',
    id: 'home-section'
  },
  { 
    label: 
      language === 'en' ? 'About Us' :
      language === 'ru' ? 'О нас' :
      language === 'zh' ? '关于我们' :
      language === 'es' ? 'Sobre nosotros' :
      language === 'hi' ? 'हमारे बारे में' :
      'معلومات عنا',
    id: 'about-section'
  },
  { 
    label: 
      language === 'en' ? 'Services' :
      language === 'ru' ? 'Услуги' :
      language === 'zh' ? '服务' :
      language === 'es' ? 'Servicios' :
      language === 'hi' ? 'सेवाएँ' :
      'الخدمات',
    id: 'services-section'
  },
  { 
    label: 
      language === 'en' ? 'News' :
      language === 'ru' ? 'Новости' :
      language === 'zh' ? '新闻' :
      language === 'es' ? 'Noticias' :
      language === 'hi' ? 'समाचार' :
      'الأخبار',
    id: 'news-section'
  },
  { 
    label: 
      language === 'en' ? 'Contacts' :
      language === 'ru' ? 'Контакты' :
      language === 'zh' ? '联系' :
      language === 'es' ? 'Contactos' :
      language === 'hi' ? 'संपर्क' :
      'اتصل بنا',
    id: 'contact-section'
  },
];


  return (
    <>
      {openDrawer && (
        <Fade in={openDrawer} timeout={300}>
          <Box
            onClick={toggleDrawer(false)}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(5px)',
              zIndex: (theme) => theme.zIndex.drawer - 1,
              transition: 'all 0.3s ease-in-out',
            }}
          />
        </Fade>
      )}

      <AppBar position="sticky" elevation={4} sx={{ background: 'linear-gradient(90deg, #1E3A8A, #3B82F6)' }}>
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1280, mx: 'auto', width: '100%', px: { xs: 2, md: 4 }, py: 1 }}>
          <Link href="/" passHref style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFFFFF', letterSpacing: 1.2 }}>Alike</Typography>
          </Link>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
            {menuItems.map((item, idx) => (
              <Button key={idx} sx={{ color: '#fff' }} onClick={() => scrollToSection(item.id)}>
                {item.label}
              </Button>
            ))}

            {/* Language Selector */}
            <Button sx={{ color: '#fff', fontWeight: 600 }} onClick={(e) => setAnchorEl(e.currentTarget)}>
              🌐 {language.toUpperCase()}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={() => { changeLanguage('ru'); setAnchorEl(null); setOpenDrawer(false); }}>Русский</MenuItem>
              <MenuItem onClick={() => { changeLanguage('en'); setAnchorEl(null); setOpenDrawer(false); }}>English</MenuItem>
              <MenuItem onClick={() => { changeLanguage('zh'); setAnchorEl(null); setOpenDrawer(false); }}>中文 (普通话)</MenuItem>
              <MenuItem onClick={() => { changeLanguage('es'); setAnchorEl(null); setOpenDrawer(false); }}>Español</MenuItem>
              <MenuItem onClick={() => { changeLanguage('hi'); setAnchorEl(null); setOpenDrawer(false); }}>हिन्दी</MenuItem>
              <MenuItem onClick={() => { changeLanguage('ar'); setAnchorEl(null); setOpenDrawer(false); }}>العربية</MenuItem>
            </Menu>
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" edge="end" color="inherit" onClick={toggleDrawer(true)} sx={{ color: '#FFFFFF' }}>
              <MenuIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
<Drawer
  anchor="right"
  open={openDrawer}
  onClose={toggleDrawer(false)}
  PaperProps={{ sx: { width: 260, bgcolor: '#1E3A8A', color: '#fff' } }}
>
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
    <IconButton onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
      <CloseIcon />
    </IconButton>
  </Box>

  <List>
    {menuItems.map((item, idx) => (
      <ListItem key={idx} disablePadding>
        <ListItemButton onClick={() => scrollToSection(item.id)}>
          <ListItemText primary={item.label} />
        </ListItemButton>
      </ListItem>
    ))}

    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 1 }} />

    {/* Mobile Language Selector */}
    {['ru', 'en', 'zh', 'es', 'hi', 'ar'].map((lang) => (
      <ListItem key={lang} disablePadding>
        <ListItemButton
          onClick={() => {
            changeLanguage(lang);
            setOpenDrawer(false);
          }}
        >
          <ListItemText
            primary={
              lang === 'ru'
                ? 'Русский'
                : lang === 'en'
                ? 'English'
                : lang === 'zh'
                ? '中文 (普通话)'
                : lang === 'es'
                ? 'Español'
                : lang === 'hi'
                ? 'हिन्दी'
                : 'العربية'
            }
          />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
</Drawer>


      {/* Scroll to Top Button */}
      <Fade in={showScroll}>
        <IconButton onClick={scrollToTop} sx={{ position: 'fixed', bottom: 32, right: 32, bgcolor: '#3B82F6', color: '#fff' }}>
          <KeyboardArrowUpIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Fade>
    </>
  );
};

export default Navbar;
