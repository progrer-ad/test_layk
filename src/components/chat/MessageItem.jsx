import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Paper,
    Avatar,
    Typography,
    Stack,
    Button,
    useMediaQuery,
    Box,
    Menu,
    MenuItem,
    TextField,
    CircularProgress,
    IconButton,
} from '@mui/material';
import { AttachFile, Edit, Delete, Check, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import LightboxModal from './LightboxModal';

/**
 * Chatdagi alohida xabarni ko'rsatish va boshqarish komponenti.
 *
 * @param {object} props - Komponentning prop'lari.
 * @param {object} props.message - Xabar obyekti.
 * @param {boolean} props.isOwn - Xabar joriy foydalanuvchinikimi.
 * @param {string} props.currentUserName - Joriy foydalanuvchi ismi.
 * @param {string} props.currentUserAvatar - Joriy foydalanuvchi avatari URL'i.
 * @param {string} props.partnerName - Hamroh foydalanuvchi ismi.
 * @param {string} props.partnerAvatar - Hamroh foydalanuvchi avatari URL'i.
 * @param {string} props.chatId - Xabar joylashgan chat ID'si.
 * @param {function} props.onUpdateMessage - Xabarni yangilash uchun callback funksiya.
 * @param {function} props.onDeleteMessage - Xabarni o'chirish uchun callback funksiya.
 */
export default function MessageItem({
    message,
    isOwn,
    currentUserName,
    currentUserAvatar,
    partnerName,
    partnerAvatar,
    chatId,
    onUpdateMessage,
    onDeleteMessage,
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const openMenu = Boolean(anchorEl);

    // Context menyuni ochish funksiyasi
    const handleContextMenu = (event) => {
        if (!isOwn) return;
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    // Context menyuni yopish funksiyasi
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Tahrirlashni boshlash
    const handleEditClick = () => {
        setIsEditing(true);
        handleCloseMenu();
    };

    // Tahrirlashni bekor qilish
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedContent(message.content || '');
    };

    // Tahrirlashni saqlash. Bu funksiya backenddagi PUT route'ga murojaat qiladi.
    const handleSaveEdit = async () => {
        if (!message.id) {
            setIsUpdating(false);
            return;
        }

        if (editedContent.trim() === message.content.trim()) {
            setIsEditing(false);
            return;
        }

        setIsUpdating(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Avtorizatsiya tokeni topilmadi.");

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${message.id}`,
                { content: editedContent.trim() },
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (onUpdateMessage) {
                onUpdateMessage(message.id, response.data);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Xabarni tahrirlashda xatolik:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Xabarni o'chirish. Bu funksiya backenddagi DELETE route'ga murojaat qiladi.
    const handleDeleteClick = async () => {
        if (!message.id) {
            handleCloseMenu();
            setIsDeleting(false);
            return;
        }

        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Avtorizatsiya tokeni topilmadi.");

            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${message.id}`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (onDeleteMessage) {
                onDeleteMessage(message.id);
            }
        } catch (error) {
            console.error('Xabarni o‘chirishda xatolik:', error);
        } finally {
            setIsDeleting(false);
            handleCloseMenu();
        }
    };

    const fileUrl = message.file_url?.startsWith('http')
        ? message.file_url
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}${message.file_url || ''}`;

    const stickerUrl = message.sticker_url?.startsWith('http')
        ? message.sticker_url
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}${message.sticker_url || ''}`;

    const fileType = message.file_type?.toLowerCase();

    // Faqat stikerdan iborat xabar uchun shart
    const isStickerOnly = !!message.sticker_url && !message.content && !message.file_url;

    // Fayl kontentini renderlash funksiyasi
    const renderFileContent = () => {
        if (!fileUrl && !stickerUrl) return null;

        if (isStickerOnly) {
            return (
                <img
                    src={stickerUrl}
                    alt="Sticker"
                    style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'contain',
                        borderRadius: '12px',
                        marginTop: '8px', // mt={1} ga teng
                    }}
                />
            );
        } else if (fileUrl && fileType) {
            if (fileType.startsWith('image')) {
                return (
                    <Box mt={1}>
                        <img
                            src={fileUrl}
                            alt={message.file_name || 'Image'}
                            onClick={() => setLightboxOpen(true)}
                            style={{
                                width: '100%',
                                maxWidth: '220px',
                                maxHeight: '200px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                cursor: 'pointer',
                            }}
                        />
                    </Box>
                );
            } else if (fileType.startsWith('video')) {
                return (
                    <Box mt={1}>
                        <video
                            controls
                            style={{
                                width: '100%',
                                maxWidth: '220px',
                                maxHeight: '200px',
                                borderRadius: '12px',
                            }}
                        >
                            <source src={fileUrl} type={message.file_type} />
                        </video>
                    </Box>
                );
            } else {
                return (
                    <Button
                        variant="outlined"
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<AttachFile />}
                        sx={{
                            mt: 1,
                            color: isOwn ? '#bbf7d0' : '#7dd3fc',
                            borderColor: isOwn ? '#bbf7d0' : '#7dd3fc',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: '#1e293b',
                                borderColor: isOwn ? '#99f6e4' : '#0ea5e9',
                            },
                        }}
                    >
                        {message.file_name || 'File'}
                    </Button>
                );
            }
        }
        return null;
    };

    const normalizeAvatar = (url, name, fallbackColor = '334155') => {
        if (url?.startsWith('http')) return url;
        if (url) return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${url}`;
        return `https://placehold.co/40x40/${fallbackColor}/fff?text=${name?.[0]?.toUpperCase() || 'U'}`;
    };

    const avatarUrl = isOwn
        ? normalizeAvatar(currentUserAvatar, currentUserName, '0ea5e9')
        : normalizeAvatar(partnerAvatar, partnerName, '64748b');

    const displayName = isOwn ? currentUserName : partnerName;

    // Read qilish useEffect
    useEffect(() => {
        const markMessageAsRead = async () => {
            try {
                if (!isOwn && !message.read_at) {
                    const token = localStorage.getItem('token');
                    if (!token) return;

                    await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${message.id}/mark-as-read`,
                        {},
                        {
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            withCredentials: true,
                        }
                    );
                }
            } catch (error) {
                console.error('Read belgilashda xatolik:', error);
            }
        };

        markMessageAsRead();
    }, [message.id, message.read_at, isOwn]);

    return (
        <>
            <Stack
                direction="row"
                spacing={1.5}
                alignItems={isStickerOnly ? 'center' : 'flex-end'}
                justifyContent={isOwn ? 'flex-end' : 'flex-start'}
                sx={{
                    width: '100%',
                    maxWidth: isMobile ? '100%' : '75%',
                    alignSelf: isOwn ? 'flex-end' : 'flex-start',
                    pl: isOwn ? 6 : 0,
                    pr: isOwn ? 0 : 6,
                }}
            >
                {!isOwn && (
                    <Avatar src={avatarUrl} sx={{ width: 36, height: 36 }}>
                        {partnerName?.charAt(0)}
                    </Avatar>
                )}

                <Paper
                    elevation={isStickerOnly ? 0 : 3} // Stiker uchun soya olib tashlandi
                    onContextMenu={handleContextMenu}
                    sx={{
                        p: isStickerOnly ? 0 : 1.5, // Stiker uchun padding olib tashlandi
                        bgcolor: isStickerOnly ? 'transparent' : (isOwn ? '#2563eb' : '#1e293b'), // Foni shaffof qilindi
                        color: isOwn ? '#ffffff' : '#f1f5f9',
                        borderRadius: isStickerOnly ? '12px' : 3,
                        borderTopLeftRadius: isOwn ? 12 : 0,
                        borderTopRightRadius: isOwn ? 0 : 12,
                        maxWidth: isStickerOnly ? '150px' : '100%', // Kenglik 150px ga o'rnatildi
                        wordBreak: 'break-word',
                        cursor: isOwn ? 'context-menu' : 'default',
                    }}
                >
                    {!isStickerOnly && (
                        <Typography
                            variant="caption"
                            fontWeight="bold"
                            sx={{ color: isOwn ? '#bbf7d0' : '#7dd3fc' }}
                        >
                            {displayName}
                        </Typography>
                    )}

                    {isEditing ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                            <TextField
                                fullWidth
                                multiline
                                size="small"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                sx={{
                                    '& .MuiInputBase-input': { color: isOwn ? 'white' : 'white' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: isOwn ? '#a5b4fc' : '#a5b4fc' },
                                        '&:hover fieldset': { borderColor: isOwn ? '#c7d2fe' : '#c7d2fe' },
                                        '&.Mui-focused fieldset': { borderColor: isOwn ? '#c7d2fe' : '#c7d2fe' },
                                    },
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <IconButton
                                    size="small"
                                    onClick={handleSaveEdit}
                                    disabled={isUpdating}
                                    sx={{ color: isOwn ? '#bbf7d0' : '#7dd3fc' }}
                                >
                                    {isUpdating ? <CircularProgress size={20} /> : <Check />}
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={handleCancelEdit}
                                    disabled={isUpdating}
                                    sx={{ color: isOwn ? '#bbf7d0' : '#7dd3fc' }}
                                >
                                    <Close />
                                </IconButton>
                            </Box>
                        </Box>
                    ) : (
                        <>
                            {isStickerOnly ? (
                                renderFileContent()
                            ) : (
                                <>
                                    {message.content && (
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                                            {message.content}
                                        </Typography>
                                    )}
                                    {renderFileContent()}
                                </>
                            )}
                        </>
                    )}

                    {isOwn && message.read_at && (
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                textAlign: 'right',
                                fontSize: '0.7rem',
                                mt: 0.5,
                                color: '#cbd5e1',
                            }}
                        >
                            {(() => {
                                const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                                const utcDate = new Date(`${message.read_at}Z`);
                                const zonedDate = toZonedTime(utcDate, userTimezone);

                                return `✔ Read ${formatDistanceToNow(zonedDate, { addSuffix: true })}`;
                            })()}
                        </Typography>
                    )}
                </Paper>

                {isOwn && (
                    <Avatar src={avatarUrl} sx={{ width: 36, height: 36 }}>
                        {currentUserName?.charAt(0)}
                    </Avatar>
                )}
            </Stack>

            {/* Context Menyusi */}
            {isOwn && (
                <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        sx: {
                            bgcolor: '#1e293b',
                            color: '#f1f5f9',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        }
                    }}
                >
                    <MenuItem onClick={handleEditClick} disabled={isDeleting}>
                        <Edit fontSize="small" sx={{ mr: 1, color: '#0ea5e9' }} /> Tahrirlash
                    </MenuItem>
                    <MenuItem onClick={handleDeleteClick} disabled={isDeleting}>
                        {isDeleting ? (
                            <CircularProgress size={20} sx={{ mr: 1, color: '#f87171' }} />
                        ) : (
                            <Delete fontSize="small" sx={{ mr: 1, color: '#f87171' }} />
                        )}
                        O'chirish
                    </MenuItem>
                </Menu>
            )}

            <LightboxModal
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                mediaUrl={fileUrl}
                mediaType={fileType}
            />
        </>
    );
}
