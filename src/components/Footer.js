import React, { useState } from "react";
import {
    Box, Grid, TextField, Button, Typography, Container,
    FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputAdornment, MenuItem, Select
} from "@mui/material";
import logo from "../assets/logo.svg"; // Ensure correct path to the logo
import "../styles/Footer.css"; // Import styles
import Textarea from '@mui/joy/Textarea';

// ✅ Country Code Options
const countryCodes = [
    { value: "+598", label: "🇺🇾 +598" },
    { value: "+54", label: "🇦🇷 +54" },
    { value: "+56", label: "🇨🇱 +56" },
    { value: "+55", label: "🇧🇷 +55" },
    { value: "+1", label: "🇺🇸 +1" },
    { value: "+34", label: "🇪🇸 +34" }
];

const Footer = () => {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState("+598"); // Default to Uruguay
    const [reason, setReason] = useState("");
    const [errors, setErrors] = useState({ phone: "", email: "" });

    // ✅ Validate Email Format
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    // ✅ Validate Phone Number Format
    const validatePhoneNumber = (number) => {
        const phoneRegex = /^\d{6,12}$/; // Adjust as needed
        return phoneRegex.test(number);
    };

    // ✅ Handle Input Changes
    const handleInputChange = (e, field) => {
        const value = e.target.value;
        if (field === "email") {
            setEmail(value);
            setErrors((prev) => ({
                ...prev,
                email: validateEmail(value) ? "" : "Correo inválido",
            }));
        }
    };

    // ✅ Handle Phone Number Change
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
        setPhone(value);
        setErrors((prev) => ({
            ...prev,
            phone: validatePhoneNumber(value) ? "" : "Debe tener entre 6 y 12 dígitos",
        }));
    };

    return (
        <Box className="footer-section">

            <Box container spacing={5} maxWidth="lg" className="footer-container">

                {/* ✅ Left Column: Logo + Text */}
                <Grid item xs={12} md={6} className="footer-left">
                    <Typography className="footer-title">Contactate con nosotros</Typography>
                    <Typography className="footer-phone">+ 598 92 275 179</Typography>
                    <Typography className="footer-text">info@wize.uy</Typography>
                    <img src={logo} alt="Wize Logo" className="footer-logo" />
                </Grid>

                {/* ✅ Right Column: Contact Form */}
                <Grid item xs={12} md={6} className="footer-right">
                    <form>
                        {/* Name */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Nombre *"
                                variant="standard"
                                fullWidth
                                className="footer-input"
                            />
                        </Grid>
                        <div className="footer-form">
                            <Grid container spacing={3}>

                                {/* Phone Input with Embedded Country Code */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Teléfono *"
                                        variant="standard"
                                        fullWidth
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        className=" footer-input"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Select
                                                        value={countryCode}
                                                        onChange={(e) => setCountryCode(e.target.value)}
                                                        variant="standard"
                                                    >
                                                        {countryCodes.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                {/* Email */}
                                <Grid item xs={12} md={6} minWidth={"200px"}>
                                    <TextField
                                        label="Email *"
                                        variant="standard"
                                        fullWidth
                                        value={email}
                                        onChange={(e) => handleInputChange(e, "email")}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        className="footer-input"
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        {/* Contact Reason */}
                        <Grid item xs={12} md={6}>
                            <FormControl component="fieldset" className="footer-radio-group">
                                <FormLabel className="footer-radio-label">Motivo *</FormLabel>
                                <RadioGroup value={reason} onChange={(e) => setReason(e.target.value)}>
                                    <FormControlLabel value="inversion" control={<Radio />} label="Inversión" />
                                    <FormControlLabel value="llamada" control={<Radio />} label="Recibir Llamada" />
                                    <FormControlLabel value="info" control={<Radio />} label="Recibir más info" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid></Grid>
                        {/* Message */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Mensaje *"
                                variant="standard"
                                fullWidth
                                multiline
                                sx={{
                                    height: "200px",
                                    overflow: "auto",
                                    "& .MuiInputBase-root": { height: "100%" }
                                }}
                                className="footer-input"
                            />
                        </Grid>
                        {/* Submit Button */}
                        <Grid item xs={12} className="full-width">
                            <Button fullWidth variant="contained" className="footer-button">
                                Enviar
                            </Button>
                        </Grid>
                    </form>
                </Grid>

            </Box >

        </Box >
    );
};

export default Footer;
