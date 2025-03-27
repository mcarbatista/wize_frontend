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
import { Link } from "react-router-dom";
import logo from "../assets/isologotipo.png";
import "../styles/Header.css";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative"
                }}
            >
                {/* ✅ Hamburger Icon (left on mobile) */}
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleDrawerToggle}
                    className="hamburger-menu"
                    sx={{
                        display: { xs: "block", sm: "none" },
                        color: "#C3AF94",
                        zIndex: 2
                    }}
                >
                    <MenuIcon />
                </IconButton>

                {/* ✅ Centered Logo */}
                <Box
                    component={Link}
                    to="/"
                    sx={{
                        position: {
                            xs: "absolute",
                            sm: "relative"
                        },
                        left: {
                            xs: "50%",
                            sm: "auto"
                        },
                        transform: {
                            xs: "translateX(-50%)",
                            sm: "none"
                        },
                        textDecoration: "none",
                        zIndex: 1
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ height: "50px", width: "auto" }}
                    />
                </Box>

                {/* ✅ Nav Buttons (only on sm and up) */}
                <Box className="nav-menu"
                    sx={{
                        // display: { xs: "none", sm: "flex" },
                        flexDirection: "row",
                        gap: 3,
                        justifyContent: "center"
                    }}
                >
                    {["INICIO", "DESARROLLOS", "PROPIEDADES", "SERVICIOS", "NOSOTROS"].map(
                        (item, index) => (
                            <Button
                                key={index}
                                component={Link}
                                to={`/${item.toUpperCase()}`}
                                sx={{
                                    fontFamily: "Avenir, sans-serif",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    color: "#C3AF94",
                                    textTransform: "none",
                                    "&:hover": { color: "#0F4C54" },
                                    "&.active": { color: "#0F4C54" }
                                }}
                            >
                                {item}
                            </Button>
                        )
                    )}
                </Box>

                {/* ✅ Contact Button (hidden on xs) */}
                <Button
                    variant="contained"
                    onClick={() => {
                        const el = document.getElementById("footer");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}

                    className="contact-button"

                    sx={{ display: { xs: "none", sm: "flex" } }}
                >
                    Contacto
                </Button>

                {/* ✅ Mobile Drawer (left side) */}
                <Drawer
                    anchor="left"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: "250px",
                            backgroundColor: "#FBF7EA"
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
                            "Contacto"
                        ].map((item, index) => (
                            <ListItem
                                button
                                key={index}
                                component={Link}
                                to={`/${item.toLowerCase()}`}
                                onClick={handleDrawerToggle}
                            >
                                <ListItemText
                                    primary={item}
                                    sx={{
                                        textAlign: "center",
                                        fontSize: "16px",
                                        color: "#0F4C54",
                                        fontWeight: "bold"
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar >
    );
};

export default Header;
