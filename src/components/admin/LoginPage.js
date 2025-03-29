import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // state for toggling visibility
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `https://wize-backend.onrender.com/api/auth/login`,
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      // Redirect to the admin panel
      navigate("/admin");
    } catch (err) {
      console.error("error:", err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9f6ef", // Cream-like background
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ color: "#333", mb: 2 }}
          >
            WizeAdmin Login
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#0F4C54", // Dark green-ish
                "&:hover": {
                  backgroundColor: "#0F4C54",
                },
              }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
