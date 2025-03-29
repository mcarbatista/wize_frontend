import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    IconButton,
    InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../api/config";
import "../../styles/Admin.css";

const ChangePassword = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleTogglePassword = () => {
        setShowNewPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            await axios.post(
                `${BASE_URL}/api/auth/change-password`,
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccessMessage("Password updated successfully!");
            // Optionally clear the fields after success
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Error updating password.");
        }
    };

    return (
        <Box p={4}>

            <Button className="admin-button"
                variant="outlined"
                sx={{ mb: 3 }}
                onClick={() => (window.location.href = "/admin")}
            >
                ← Volver al Panel de Administración
            </Button>

            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
                textAlign="center"
                p={4}
                gap={4}
            >
                <Typography variant="h4" className="admin-title">
                    Cambiar contraseña
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ width: "100%", maxWidth: "400px" }}
                >
                    <TextField
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="New Password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePassword} edge="end">
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        label="Confirm New Password"
                        type={showNewPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    {successMessage && (
                        <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
                            {successMessage}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Update Password
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ChangePassword;
