import React from 'react';
import { Box, Typography, Divider, useMediaQuery, useTheme } from '@mui/material';
import '../styles/HomeStaging.css';

const stats = [
    {
        value: "81%",
        description: "Dijeron que preparar una casa hizo más fácil que un comprador la visualizara como su hogar futuro.",
    },
    {
        value: "73%",
        description: "Menos tiempo en el mercado en comparación con las casas no preparadas con Home Staging.",
    },
    {
        value: "5-10%",
        description: "Aumento de valor en comparación con propiedades similares no preparadas con Home Staging.",
    },
];

const HomeStagingStats = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box className="stats-container">
            <Typography variant="subtitle1" className="stats-title">
                2023. – Asociación Nacional de Agentes Inmobiliarios – Estadísticas sobre HOME STAGING.
            </Typography>

            <Divider className="stats-divider" />

            <Box className={`stats-row ${isMobile ? 'column' : 'row'}`}>
                {stats.map((stat, index) => (
                    <Box
                        key={index}
                        className={`stat-block ${!isMobile && index !== stats.length - 1 ? 'with-divider' : ''}`}
                    >
                        <Typography variant="h3" className="stat-value">
                            {stat.value}
                        </Typography>
                        <Typography variant="body1" className="stat-description">
                            {stat.description}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default HomeStagingStats;
