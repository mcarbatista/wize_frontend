import React from 'react';
import { Dialog, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FullScreenMediaDialog = ({ open, onClose, mediaUrl }) => {
    // Basic check for video by extension
    const isVideo =
        mediaUrl &&
        (mediaUrl.endsWith('.mp4') ||
            mediaUrl.endsWith('.webm') ||
            mediaUrl.endsWith('.ogg'));

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            {/* Close Button */}
            <IconButton
                edge="start"
                color="inherit"
                onClick={onClose}
                aria-label="close"
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1000,
                }}
            >
                <CloseIcon />
            </IconButton>

            {/* Container to center media and provide spacing */}
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    p: 2, // padding around the edges (theme spacing = 8px * 2 = 16px)
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'black', // optional dark background
                }}
            >
                {isVideo ? (
                    <video
                        src={mediaUrl}
                        style={{
                            maxWidth: '100%',   // never overflow horizontally
                            maxHeight: '100%',  // never overflow vertically
                        }}
                        autoPlay
                        controls
                    />
                ) : (
                    <img
                        src={mediaUrl}
                        alt="Full view"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                        }}
                    />
                )}
            </Box>
        </Dialog>
    );
};

export default FullScreenMediaDialog;
