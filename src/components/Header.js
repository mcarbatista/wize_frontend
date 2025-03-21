import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import logo from "../assets/isologotipo.png";
import "../styles/Header.css"; // ✅ Import Header Styles

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false); // State for mobile menu

    // Change header background when scrolling
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Toggle mobile menu
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
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>

                {/* Left Side: Logo (Hidden on Mobile) */}
                <Box
                    component={Link}
                    to="/"
                    sx={{
                        display: { xs: "none", sm: "block" }, // Hide on small screens
                        marginLeft: "20px",
                        textDecoration: "none"
                    }}
                >
                    <img src={logo} alt="Logo" style={{ height: "50px", width: "auto" }} />
                </Box>

                {/* Centered Menu Items (Hidden on Mobile) */}
                <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 3, flexGrow: 1, justifyContent: "center" }}>
                    {["INICIO", "DESARROLLOS", "PROPIEDADES", "SERVICIOS", "NOSOTROS"].map((item, index) => (
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
                                transition: "color 0.3s",
                                "&:hover": { color: "#0F4C54" },
                                "&.active": { color: "#0F4C54" },
                            }}
                        >
                            {item}
                        </Button>
                    ))}
                </Box>

                {/* Right Side: Contact CTA (Hidden on Mobile) */}
                <Button
                    variant="contained"
                    component={Link}
                    to="/contacto"
                    className="contact-button"
                >
                    Contacto
                </Button>

                {/* Hamburger Menu Icon (Only on Mobile) */}
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleDrawerToggle}
                    sx={{ display: { xs: "block", sm: "none" }, color: "#C3AF94" }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Mobile Sidebar Drawer */}
                <Drawer
                    anchor="right"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    sx={{
                        "& .MuiDrawer-paper": { width: "250px", backgroundColor: "#FBF7EA" },
                    }}
                >
                    <List>
                        {["INICIO", "DESARROLLOS", "PROPIEDADES", "SERVICIOS", "NOSOTROS", "Contacto"].map((item, index) => (
                            <ListItem button key={index} component={Link} to={`/${item.toLowerCase()}`} onClick={handleDrawerToggle}>
                                <ListItemText
                                    primary={item}
                                    sx={{
                                        textAlign: "center",
                                        fontSize: "16px",
                                        color: "#0F4C54",
                                        fontWeight: "bold",
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
