import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardMedia, Typography } from '@mui/material';

const RelatedProperties = ({ relatedProperties = [] }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,            // spacing between cards
                overflowX: 'auto', // horizontal scroll
                p: 2,              // padding around the container
            }}
        >
            {relatedProperties.map((prop) => {
                const imageUrl =
                    prop.Imagen || 'https://via.placeholder.com/280x400?text=Sin+imagen';

                return (
                    <Card
                        key={prop._id}
                        sx={{
                            position: 'relative',
                            width: 280,
                            height: 400,
                            borderRadius: 2,
                            overflow: 'hidden',
                            flexShrink: 0, // ensures card doesn't shrink in a scroll container
                        }}
                    >
                        <Link
                            to={`/propiedades/${prop._id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            {/* CardMedia can be used as a "div" that sets a background image */}
                            <CardMedia
                                component="div"
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `url(${imageUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {/* Overlay at the bottom */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        color: '#fff',
                                        p: 1.5,
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        {prop.Titulo}
                                    </Typography>
                                    <Typography variant="body2">
                                        $ {prop.Precio_Con_Formato}
                                    </Typography>
                                </Box>
                            </CardMedia>
                        </Link>
                    </Card>
                );
            })}
        </Box>
    );
};

export default RelatedProperties;
