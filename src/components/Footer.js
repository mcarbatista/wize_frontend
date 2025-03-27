import React, { useState } from "react";
import {
    Box, Grid, TextField, Button, Typography,
    FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputAdornment, MenuItem, Select
} from "@mui/material";
import emailjs from 'emailjs-com';
import { useRef } from 'react';
import logo from "../assets/logo.svg"; // Ensure correct path to the logo
import "../styles/Footer.css"; // Import styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';




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
    const [successMessage, setSuccessMessage] = useState(false);

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

    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm(
            'service_om33tkw',
            'template_67t1su4',
            form.current,
            'gqylhjYRFul99n-TP'
        )
            .then((result) => {
                setSuccessMessage(true);
                // Clear fields
                setEmail("");
                setPhone("");
                setCountryCode("+598");
                setReason("");
                form.current.reset();
                console.log('✅ Email sent:', result.text);
                alert("Mensaje enviado con éxito");
            }, (error) => {
                console.log('❌ Error:', error.text);
                alert("Hubo un error. Intenta de nuevo.");
            });
    };

    return (
        <footer id="footer">
            <Box className="footer-section">

                <Box container spacing={5} maxWidth="lg" className="footer-container">

                    {/* ✅ Left Column: Logo + Text */}
                    <Box item xs={12} md={6} className="footer-left" >
                        <Typography className="footer-title"> Contactate con nosotros</Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                            <FontAwesomeIcon icon={faPhone} />
                            <Typography className="footer-phone"> + 598 92 275 179</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={2}>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <Typography className="footer-text">info@wize.uy</Typography></Box>
                        {/* <FontAwesomeIcon icon={faInstagram} /> */}
                        <img src={logo} alt="Wize Logo" className="footer-logo" />
                    </Box>

                    {/* ✅ Right Column: Contact Form */}
                    <Grid item xs={12} md={6} className="footer-right">
                        <Box sx={{ maxWidth: "450px", width: "100%", margin: "0 auto" }}>
                            <form maxWidth="450px" ref={form} onSubmit={sendEmail}>
                                {/* Name */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Nombre *"
                                        name="user_name"
                                        variant="standard"
                                        fullWidth
                                        className="footer-input"
                                    />
                                </Grid>
                                {/* Phone & email */}
                                <Grid item spacing={3}>

                                    {/* Phone Input with Embedded Country Code */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Teléfono *"
                                            name="user_phone"
                                            variant="standard"
                                            fullWidth
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            error={!!errors.phone}
                                            helperText={errors.phone}
                                            className="footer-input"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Select
                                                            value={countryCode}
                                                            onChange={(e) => setCountryCode(e.target.value)}
                                                            variant="standard"
                                                            className="no-border"
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
                                            name="user_email"
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

                                {/* Contact Reason */}
                                <Grid item xs={12} md={6}>
                                    <FormControl component="fieldset" className="footer-radio-group">
                                        <FormLabel className="footer-radio-label">Motivo *</FormLabel>
                                        <RadioGroup
                                            className="footer-radial-container"
                                            name="reason"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}>
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
                                        name="message"
                                        variant="standard"
                                        fullWidth
                                        multiline
                                        sx={{
                                            height: "150px",
                                            overflow: "auto",
                                            "& .MuiInputBase-root": { height: "100%" }
                                        }}
                                        className="footer-input"
                                    />
                                </Grid>
                                {/* Submit Button */}
                                <Grid item xs={12} className="full-width">
                                    <Button type="submit" fullWidth variant="contained" className="footer-button">
                                        Enviar
                                    </Button>
                                </Grid>

                                {/*  Snackbar confirmation */}
                                <Snackbar
                                    open={successMessage}
                                    autoHideDuration={5000}
                                    onClose={() => setSuccessMessage(false)}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                >
                                    <MuiAlert
                                        onClose={() => setSuccessMessage(false)}
                                        severity="success"
                                        sx={{ width: '100%' }}
                                        elevation={6}
                                        variant="filled"
                                    >
                                        ¡Gracias! Tu mensaje fue enviado con éxito.
                                    </MuiAlert>
                                </Snackbar>
                            </form>
                        </Box >
                    </Grid>
                </Box >
            </Box >
        </footer >
    );
};

export default Footer;
