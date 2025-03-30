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
                    // Center content up to a max width (optional)
                    width: "100%",
                    maxWidth: "1200px",
                    mx: "auto",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative"
                }}
            >
                {/* HAMBURGER ICON: Hidden above 1000px, shown below 1000px */}
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

                {/* LOGO: Centered below 1000px by using absolute positioning */}
                <Box
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        position: "relative",
                        zIndex: 1,

                        // When under 1000px, position absolute in the center
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

                {/* NAV BUTTONS: Shown above 1000px, hidden below */}
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
                        (item, index) => (
                            <Button
                                key={index}
                                component={Link}
                                to={`/${item.toLowerCase()}`}
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

                {/* CONTACTO BUTTON: Shown above 1000px, hidden below */}
                <Button
                    variant="contained"
                    onClick={() => {
                        const el = document.getElementById("footer");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    sx={{
                        // Our custom styles
                        background: "transparent",
                        border: "2px solid #0F4C54",
                        color: "#0F4C54",
                        fontSize: "1.0rem",
                        fontFamily: "Avenir Light, sans-serif",
                        padding: "8px 30px",
                        borderRadius: "30px",
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": {
                            color: "#C3AF94",
                            borderColor: "#C3AF94",
                            boxShadow: "none"
                        },

                        // Hide below 1000px
                        "@media (max-width:1000px)": {
                            display: "none"
                        }
                    }}
                >
                    Contacto
                </Button>

                {/* MOBILE DRAWER: slides in from left when hamburger is clicked */}
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
                                        fontWeight: "bold",
                                        fontFamily: "Avenir Medium, sans serif"
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
