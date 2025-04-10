import React, { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/isologotipo.png";
import "../styles/Header.css";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleInicioClick = () => {
        if (location.pathname === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            navigate("/");
        }
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                backgroundColor: scrolled ? "#FBF7EA" : "transparent",
                transition: "background-color 0.3s ease-in-out",
                padding: "10px 0",
                width: "100%"
            }}
        >
            <Toolbar
                sx={{
                    width: "100%",
                    maxWidth: "1200px",
                    mx: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative"
                }}
            >
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleDrawerToggle}
                    sx={{
                        display: "none",
                        color: "#C3AF94",
                        zIndex: 2,
                        "@media (max-width:1000px)": {
                            display: "block"
                        }
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Box
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        position: "relative",
                        zIndex: 1,
                        "@media (max-width:1000px)": {
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)"
                        }
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ height: "50px", width: "auto" }}
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 3,
                        justifyContent: "center",
                        "@media (max-width:1000px)": {
                            display: "none"
                        }
                    }}
                >
                    {["INICIO", "DESARROLLOS", "PROPIEDADES", "SERVICIOS", "NOSOTROS"].map(
                        (item, index) => {
                            const path = `/${item.toLowerCase()}`;
                            return (
                                <Button
                                    key={index}
                                    onClick={
                                        item === "INICIO"
                                            ? handleInicioClick
                                            : () => navigate(path)
                                    }
                                    sx={{
                                        fontFamily: "Avenir Medium, sans-serif",
                                        fontSize: "15px",
                                        fontWeight: "bold",
                                        color: "#C3AF94",
                                        textTransform: "none",
                                        "&:hover": { color: "#0F4C54" },
                                        "&.active": { color: "#0F4C54" }
                                    }}
                                >
                                    {item}
                                </Button>
                            );
                        }
                    )}
                </Box>

                <Button
                    variant="contained"
                    onClick={() => {
                        const el = document.getElementById("footer");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    sx={{
                        background: "#FBF7EA",
                        border: "1px solid #0F4C54",
                        color: "#0F4C54",
                        fontSize: "1.0rem",
                        fontFamily: "Avenir Light, sans-serif",
                        padding: "8px 30px",
                        borderRadius: "30px",
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": {
                            color: "#C3AF94",
                            border: "1px solid #C3AF94",
                            boxShadow: "none"
                        },
                        "@media (max-width:1000px)": {
                            display: "none"
                        }
                    }}
                >
                    Contacto
                </Button>

                <Drawer
                    anchor="left"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: "250px",
                            backgroundColor: "#FBF7EA",
                            opacity: "0.9",
                        }
                    }}
                >
                    <List>
                        {[
                            "INICIO",
                            "DESARROLLOS",
                            "PROPIEDADES",
                            "SERVICIOS",
                            "NOSOTROS",
                            "CONTACTO"
                        ].map((item, index) => {
                            const path = `/${item.toLowerCase()}`;
                            const handleClick = () => {
                                handleDrawerToggle();
                                if (item === "INICIO") {
                                    handleInicioClick();
                                } else {
                                    navigate(path);
                                }
                            };

                            return (
                                <ListItem
                                    button
                                    key={index}
                                    onClick={handleClick}
                                >
                                    <ListItemText
                                        primary={item}
                                        sx={{
                                            textAlign: "center",
                                            fontSize: "16px",
                                            color: "#0F4C54",
                                            fontWeight: "bold",
                                            fontFamily: "Avenir Medium, sans serif"
                                        }}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
