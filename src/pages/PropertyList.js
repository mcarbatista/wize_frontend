import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState({ city: '', status: '', priceRange: [0, 1000000] });

    useEffect(() => {
        axios.get('/api/properties').then(response => setProperties(response.data));
    }, []);

    return (
        <Container>
            <Typography variant='h4' gutterBottom>Available Properties</Typography>
            <Grid container spacing={2}>
                {properties.map(property => (
                    <Grid item xs={12} sm={6} md={4} key={property._id}>
                        <Card>
                            <CardMedia component='img' height='200' image={property.images[0]} alt={property.title} />
                            <CardContent>
                                <Typography variant='h6'>{property.title}</Typography>
                                <Typography variant='body2' color='textSecondary'>{property.city}, {property.neighborhood}</Typography>
                                <Typography variant='body1'>${property.price}</Typography>
                                <Link to={`/properties/${property._id}`}>View Details</Link>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default PropertyList;
