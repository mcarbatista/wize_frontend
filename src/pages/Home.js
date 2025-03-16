import React from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <Container sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant='h3' gutterBottom>Find Your Dream Property</Typography>
            <Typography variant='h6' color='textSecondary' paragraph>
                Browse the best properties available in your area.
            </Typography>
            <Button variant='contained' color='primary' component={Link} to='/properties'>View Listings</Button>
        </Container>
    );
};

export default Home;
