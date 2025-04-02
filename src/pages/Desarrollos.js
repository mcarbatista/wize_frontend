import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Collapse,
    Typography,
    Select,
    MenuItem,
    Box,
    Button,
    Slider
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

import "../styles/Properties.css";
import BASE_URL from "../api/config";

const Desarrollos = () => {
    document.title = `Wize | Lista de Desarrollos`;

    const [desarrollos, setDesarrollos] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [neighborhoodFilter, setNeighborhoodFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState([]);
    const [cityFilter, setCityFilter] = useState([]);
    // const [priceRange, setPriceRange] = useState([0, 30000000]);

    // Dynamic filter options
    const [statusOptions, setStatusOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [neighborhoodOptions, setNeighborhoodOptions] = useState([]);

    // Responsive state for collapsing filter container on small devices
    const isSmallDevice = useMediaQuery("(max-width:600px)");
    const [expanded, setExpanded] = useState(!isSmallDevice);

    useEffect(() => {
        document.title = "Wize | Desarrollos";
        fetchDesarrollos();
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setExpanded(!isSmallDevice);
    }, [isSmallDevice]);

    const fetchDesarrollos = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/desarrollos`);
            const desarrollos = response.data;

            console.log("📢 API Response:", desarrollos);

            if (!Array.isArray(desarrollos)) {
                console.error("❌ API did not return an array.");
                return;
            }

            // Extract unique values for filters
            const uniqueStatus = [...new Set(desarrollos.map(p => p.Estado))].filter(Boolean).sort();
            const uniqueCities = [...new Set(desarrollos.map(p => p.Ciudad))].filter(Boolean).sort();
            const uniqueNeighborhoods = [...new Set(desarrollos.map(p => p.Barrio))].filter(Boolean).sort();

            setStatusOptions(uniqueStatus);
            setCityOptions(uniqueCities);
            setNeighborhoodOptions(uniqueNeighborhoods);

            let filteredData = desarrollos;

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
            // filteredData = filteredData.filter(
            //     (desarrollo) => desarrollo.Precio >= priceRange[0] && desarrollo.Precio <= priceRange[1]
            // );

            // Apply Sorting
            filteredData.sort((a, b) => {
                return sortOrder === "asc"
                    ? a.Precio - b.Precio
                    : b.Precio - a.Precio;
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
                {isSmallDevice && (
                    <Button
                        variant="contained"
                        onClick={() => setExpanded(!expanded)}
                        className="filter-toggle-button"
                        sx={{ mb: 2 }}
                    >
                        {expanded ? "Ocultar Filtros ↑" : "Mostrar Filtros ↓"}
                    </Button>
                )}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box container spacing={3} className="filter-grid">
                        <Box item xs={12} sm={12} md={9} className="filter-column-params">
                            {[
                                { label: "Estado", value: statusFilter, setValue: setStatusFilter, options: statusOptions },
                                { label: "Ciudad", value: cityFilter, setValue: setCityFilter, options: cityOptions },
                                { label: "Barrio", value: neighborhoodFilter, setValue: setNeighborhoodFilter, options: neighborhoodOptions }
                            ].map(({ label, value, setValue, options }) => (
                                <Box key={label} sx={{ width: { xs: "100%", sm: "48%", md: "18%" } }} className="filter-column">
                                    <Typography className="filter-title">{label}</Typography>
                                    <Select
                                        multiple
                                        fullWidth
                                        value={value}
                                        onChange={(e) => setValue(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                                        className='filter-select'
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
                            <Box item xs={12} sm={12} md={3} className="filter-column">
                                <Box sx={{ width: "100%" }}>
                                    <Typography className="filter-title">Ordenar por Precio</Typography>
                                    <Select fullWidth value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-select">
                                        <MenuItem value="asc">Menor a Mayor</MenuItem>
                                        <MenuItem value="desc">Mayor a Menor</MenuItem>
                                    </Select>
                                    {/* <Typography className="filter-title">Rango de Precio</Typography>
                  <Slider
                      value={priceRange}
                      onChange={(e, newValue) => setPriceRange(newValue)}
                      valueLabelDisplay="auto"
                      min={50000}
                      max={2000000}
                      step={50000}
                      className="price-slider"
                  /> */}
                                </Box>
                            </Box>
                        </Box>
                        <Box className="filter-column">
                            <button onClick={fetchDesarrollos} className="search-button">
                                Buscar Desarrollos
                            </button>
                        </Box>
                    </Box>
                </Collapse>
            </Box>

            <Grid className="property-list">
                {desarrollos.length === 0 ? (
                    <Typography>No hay desarrollos disponibles con los filtros seleccionados.</Typography>
                ) : (
                    desarrollos.map((desarrollo, index) => (
                        <Card className="property-card-dev" key={index}>
                            <Link to={`/desarrollos/${desarrollo._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <CardMedia component="img" image={desarrollo.Imagen} alt={desarrollo.Title} sx={{ height: "200px" }} />
                                <CardContent>
                                    <Typography className="property-status">{desarrollo.Estado}</Typography>
                                    <Typography className="property-price">Desde ${desarrollo.Precio_Con_Formato}</Typography>
                                    <Typography className="property-title-desarrollos" variant="h6">{desarrollo.Proyecto_Nombre}</Typography>
                                    <Typography className="property-barrio" variant="h6">{desarrollo.Barrio} </Typography>
                                    <Typography className="desarrollo-entrega">{desarrollo.Entrega}</Typography>
                                </CardContent>
                            </Link>
                        </Card>
                    ))
                )}
            </Grid>
        </Box>
    );
};

export default Desarrollos;
