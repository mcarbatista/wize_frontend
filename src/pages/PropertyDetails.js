import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardMedia, CardContent, Grid } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);

    useEffect(() => {
        axios.get(`/api/properties/${id}`).then(response => setProperty(response.data));
    }, [id]);

    if (!property) return <Typography>Loading...</Typography>;

    return (
        <Container>
            <Typography variant='h3' gutterBottom>{property.title}</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardMedia component='img' height='400' image={property.images[0]} alt={property.title} />
                        <CardContent>
                            <Typography variant='body1'>{property.longDescription}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant='h6'>Price: ${property.price}</Typography>
                    <Typography variant='body1'>Bedrooms: {property.bedrooms}, Bathrooms: {property.bathrooms}</Typography>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PropertyDetails;
