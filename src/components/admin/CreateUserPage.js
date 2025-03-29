import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import BASE_URL from "../../api/config";

const roles = ['admin', 'agente'];

const CreateUserPage = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('agente'); // default role
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // 1. Check if we have a token in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // 2. Decode the token to see if it’s expired or if user has the correct role
        try {
            const decoded = jwtDecode(token);
            // Check if token is expired
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            // (Optional) Check user role if your backend requires an admin for user creation
            // if (decoded.role !== 'admin') {
            //   setError('You do not have permission to create new users');
            //   navigate('/admin'); // or wherever you want to send non-admin users
            // }

        } catch (err) {
            console.error('Error decoding token:', err);
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            console.log("Token in localStorage:", localStorage.getItem("token"));

            if (!token) {
                setError('Missing token. Please log in again.');
                return;
            }

            const res = await axios.post(
                `${BASE_URL}/api/auth/register`,
                { nombre, email, password, role },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccess('User created successfully!');
            // Optionally, reset form fields
            setNombre('');
            setEmail('');
            setPassword('');
            setRole('agente');
            // Or navigate somewhere else
            // navigate('/admin/desarrollos');
        } catch (err) {
            console.error('Error creating user:', err);
            setError(err.response?.data?.error || 'Error creating user');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f9f6ef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 3,
                        backgroundColor: '#fff',
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
                        Create New User
                    </Typography>

                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    {success && (
                        <Typography color="primary" sx={{ mb: 2 }}>
                            {success}
                        </Typography>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Name"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
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
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {/* Role selection */}
                        <TextField
                            select
                            fullWidth
                            margin="normal"
                            label="Role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            {roles.map((r) => (
                                <MenuItem key={r} value={r}>
                                    {r}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2,
                                backgroundColor: '#1b4b47',
                                '&:hover': {
                                    backgroundColor: '#163e3c',
                                },
                            }}
                        >
                            Create User
                        </Button>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default CreateUserPage;
