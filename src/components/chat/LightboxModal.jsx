import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

/**
 * Rasmlar va videolar uchun Lightbox modali.
 *
 * @param {object} props - Komponentning prop'lari.
 * @param {boolean} props.open - Modal ochiq yoki yo'qligi.
 * @param {function} props.onClose - Modalni yopish funksiyasi.
 * @param {string} props.mediaUrl - Media faylining URL'i.
 * @param {string} props.mediaType - Media faylining turi ('image' yoki 'video').
 */
export default function LightboxModal({ open, onClose, mediaUrl, mediaType }) {
    if (!open) return null;

    const isImage = mediaType?.startsWith('image');
    const isVideo = mediaType?.startsWith('video');

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: isImage ? '90%' : '600px',
                    height: 'auto',
                    bgcolor: 'rgba(0, 0, 0, 0.85)',
                    p: 2,
                    boxShadow: 24,
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    maxHeight: '90vh',
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'white',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {isImage && (
                    <img
                        src={mediaUrl}
                        alt="Media"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '85vh',
                            objectFit: 'contain',
                        }}
                    />
                )}

                {isVideo && (
                    <video
                        controls
                        src={mediaUrl}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '85vh',
                            objectFit: 'contain',
                        }}
                    >
                        Browseringiz video tagini qo'llab-quvvatlamaydi.
                    </video>
                )}
            </Box>
        </Modal>
    );
}
