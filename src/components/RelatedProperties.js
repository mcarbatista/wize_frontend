import React from "react";
import { Link } from "react-router-dom";
import { Grid, Card, CardMedia, Typography, Box } from "@mui/material";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

const RelatedProperties = ({ relatedProperties = [] }) => {
    return (
        <Grid container spacing={3}>
            {relatedProperties.map((prop) => {
                const imageUrl =
                    prop.Imagen || "https://via.placeholder.com/280x400?text=Sin+imagen";

                return (
                    <Grid item xs={12} sm={6} lg={4} key={prop._id}>
                        <Card
                            sx={{
                                position: "relative",
                                borderRadius: 2,
                                overflow: "hidden",
                                width: "100%",
                                margin: "0 auto",
                                height: 0,
                                paddingBottom: "180%",
                            }}
                        >
                            <a
                                href={`/propiedades/${prop._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <CardMedia
                                    component="div"
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundImage: `url(${imageUrl})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    {/* Overlay at the bottom */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            backgroundColor: "rgba(255, 255, 255, 0.59)",
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2,
                                            color: "#000",
                                            fontFamily: "Avenir, sans-serif",
                                        }}
                                    >
                                        {/* Price and Title */}
                                        <Box sx={{ mb: 1 }}>
                                            <Typography sx={{ fontSize: "1.2rem", fontWeight: 350, paddingBottom: "8%" }}>
                                                $ {prop.Precio_Con_Formato}
                                            </Typography>
                                            <Typography sx={{ fontSize: "1rem" }}>
                                                {prop.Titulo}
                                            </Typography>
                                        </Box>
                                        {/* Icon Row */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <FaBed style={{ fontSize: "1.5rem" }} />
                                                <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                                                    {prop.Dormitorios}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <FaBath style={{ fontSize: "1.2rem" }} />
                                                <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                                                    {prop.Banos}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <FaRulerCombined style={{ fontSize: "1.2rem" }} />
                                                <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                                                    {prop.Tamano_m2} m²
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardMedia>
                            </a>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default RelatedProperties;
