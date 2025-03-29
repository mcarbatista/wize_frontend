import React from "react";
import { Link } from "react-router-dom";
import { Grid, Card, CardMedia, Typography, Box } from "@mui/material";

const RelatedProperties = ({ relatedProperties = [] }) => {
    return (
        <Grid container spacing={2}>
            {relatedProperties.map((prop) => {
                const imageUrl =
                    prop.Imagen || "https://via.placeholder.com/280x400?text=Sin+imagen";

                return (
                    <Grid
                        item
                        xs={12}  // 1 column on mobile
                        sm={6}   // 2 columns on iPad Air / small screens (≥600px)
                        lg={3}   // 4 columns on large screens (≥1200px)
                        key={prop._id}
                    >
                        <Card
                            sx={{
                                position: "relative",
                                borderRadius: 2,
                                overflow: "hidden",
                                width: "100%",
                                // Maintain aspect ratio via padding:
                                height: 0,
                                paddingBottom: "140%", // Adjust for desired aspect ratio
                            }}
                        >
                            <Link
                                to={`/propiedades/${prop._id}`}
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
                                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                                            color: "#fff",
                                            p: 1.5,
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                            {prop.Titulo}
                                        </Typography>
                                        <Typography variant="body2">
                                            $ {prop.Precio_Con_Formato}
                                        </Typography>
                                    </Box>
                                </CardMedia>
                            </Link>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default RelatedProperties;
