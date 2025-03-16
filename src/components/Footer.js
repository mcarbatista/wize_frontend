import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant='body2'>&copy; {new Date().getFullYear()} Real Estate App</Typography>
        </Box>
    );
};

export default Footer;
