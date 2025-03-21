import React, { useState, useEffect } from "react";
import {
    Grid, Card, CardMedia, CardContent, Typography, Select, MenuItem, Box, Slider
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import "../styles/Properties.css";

const Desarrollos = () => {
    const [desarrollos, setDesarrollos] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [neighborhoodFilter, setNeighborhoodFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState([]);
    const [cityFilter, setCityFilter] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 3000000]);

    // Dynamic filter options
    const [statusOptions, setStatusOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [neighborhoodOptions, setNeighborhoodOptions] = useState([]);

    useEffect(() => {
        fetchDesarrollos();
    }, []);
    //[sortOrder, neighborhoodFilter, statusFilter, cityFilter, bedroomFilter, bathroomFilter, priceRange]
    const fetchDesarrollos = async () => {
        try {
            const response = await axios.get("https://wize-backend.onrender.com/api/desarrollos");
            const properties = response.data;

            console.log("📢 API Response:", properties);

            if (!Array.isArray(properties)) {
                console.error("❌ API did not return an array.");
                return;
            }

            // Extract unique values for filters
            const uniqueStatus = [...new Set(properties.map(p => p.Estado))].filter(Boolean).sort();
            const uniqueCities = [...new Set(properties.map(p => p.Ciudad))].filter(Boolean).sort();
            const uniqueNeighborhoods = [...new Set(properties.map(p => p.Barrio))].filter(Boolean).sort();

            setStatusOptions(uniqueStatus);
            setCityOptions(uniqueCities);
            setNeighborhoodOptions(uniqueNeighborhoods);

            let filteredData = properties;

            // Apply Filters
            if (neighborhoodFilter.length > 0) {
                filteredData = filteredData.filter((desarrollo) => neighborhoodFilter.includes(desarrollo.Barrio));
            }

            if (statusFilter.length > 0) {
                filteredData = filteredData.filter((desarrollo) => statusFilter.includes(desarrollo.Estado));
            }

            if (cityFilter.length > 0) {
                filteredData = filteredData.filter((desarrollo) => cityFilter.includes(desarrollo.Ciudad));
            }
            filteredData = filteredData.filter(
                (desarrollo) => desarrollo.Precio_Numerico >= priceRange[0] && desarrollo.Precio_Numerico <= priceRange[1]
            );

            // Apply Sorting
            filteredData.sort((a, b) => {
                return sortOrder === "asc"
                    ? a.Precio_Numerico - b.Precio_Numerico
                    : b.Precio_Numerico - a.Precio_Numerico;
            });

            setDesarrollos(filteredData);
        } catch (error) {
            console.error("❌ Error fetching desarrollos:", error);
        }
    };

    return (
        <Box>
            <Box className="title-section">
                <Typography className="title-text">Desarrollos</Typography>
            </Box>

            <Box className="filter-container">
                <Grid container spacing={3} className="filter-grid">
                    <Grid item xs={12} sm={12} md={9} className="filter-column-params" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                        {[
                            // { label: "Estado", value: statusFilter, setValue: setStatusFilter, options: statusOptions },
                            { label: "Estado", value: statusFilter, setValue: setStatusFilter, options: statusOptions },
                            { label: "Ciudad", value: cityFilter, setValue: setCityFilter, options: cityOptions },
                            { label: "Barrio", value: neighborhoodFilter, setValue: setNeighborhoodFilter, options: neighborhoodOptions }
                        ].map(({ label, value, setValue, options }) => (
                            <Box key={label} sx={{ width: { xs: "100%", sm: "48%", md: "18%" } }}>
                                <Typography className="filter-title">{label}</Typography>
                                <Select
                                    multiple
                                    fullWidth
                                    value={value}
                                    onChange={(e) => setValue(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                                    className='filter-select'
                                    // {value.includes(option) ? "menu-item-selected" : "menu-item"}'
                                    renderValue={(selected) => selected.join(", ")}

                                >
                                    {options.length > 0 ? (
                                        options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)
                                    ) : (
                                        <MenuItem disabled>Cargando...</MenuItem>
                                    )}
                                </Select>
                            </Box>
                        ))}
                        {/* 🔹 Search Button */}


                        <Grid item xs={12} sm={12} md={3} className="filter-column">
                            <Box sx={{ width: "100%" }}>
                                <Typography className="filter-title">Ordenar por Precio</Typography>
                                <Select fullWidth value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-select">
                                    <MenuItem value="asc">Menor a Mayor</MenuItem>
                                    <MenuItem value="desc">Mayor a Menor</MenuItem>
                                </Select>
                            </Box>
                            {/* <Grid item xs={12} sm={3} md={3} className="filter-column">
                            <Box>
                                <Typography className="filter-title">Rango de Precio</Typography>
                                <Slider
                                    value={priceRange}
                                    onChange={(e, newValue) => setPriceRange(newValue)}
                                    valueLabelDisplay="auto"
                                    min={50000}
                                    max={2000000}
                                    step={50000}
                                    className="price-slider"
                                />
                            </Box>
                        </Grid> */}
                        </Grid>
                        <Grid item xs={12} >
                            <Box className="filter-button-container" display="flex" justifyContent="center" mt={3}>
                                <button
                                    onClick={fetchDesarrollos}
                                    className="search-button"
                                >
                                    Buscar Desarrollos
                                </button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            <Box className="property-list">
                {desarrollos.length === 0 ? (
                    <Typography>No hay desarrollos disponibles con los filtros seleccionados.</Typography>
                ) : (
                    desarrollos.map((desarrollo, index) => (
                        <Card className="property-card" key={index}>
                            <Link to={`/desarrollo/${desarrollo._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <CardMedia component="img" image={desarrollo.Imagen} alt={desarrollo.Title} />
                                <CardContent>
                                    <Typography className="property-status">{desarrollo.Estado}</Typography>
                                    <Typography className="property-price">Desde {desarrollo.Precio}</Typography>
                                    <Typography className="property-title" variant="h6">{desarrollo.Proyecto_Nombre}</Typography>
                                    <Typography className="property-barrio" variant="h6">{desarrollo.Barrio} </Typography>
                                    <Typography className="desarrollo-entrega">{desarrollo.Entrega}</Typography>
                                </CardContent>
                            </Link>
                        </Card>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default Desarrollos;