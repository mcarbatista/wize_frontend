import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const roles = ['admin', 'agent'];

const CreateUserPage = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('agent'); // default role
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                '/api/auth/register',
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
            setRole('agent');
            // Or navigate somewhere else
            // navigate('/admin/desarrollos');
        } catch (err) {
            console.error(err);
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
