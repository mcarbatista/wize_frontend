import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Select,
    MenuItem,
    Box,
    Button,
    Collapse,
    Slider
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import "../styles/Properties.css";
import BASE_URL from "../api/config";

const Propiedades = () => {
    document.title = `Wize | Lista de Propiedades`;

    const [propiedades, setPropiedades] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [neighborhoodFilter, setNeighborhoodFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState([]);
    const [cityFilter, setCityFilter] = useState([]);
    const [bedroomFilter, setBedroomFilter] = useState([]);
    const [bathroomFilter, setBathroomFilter] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 3000000]);
    const [TipoFilter, setTipoFilter] = useState([]);

    // Dynamic filter options
    const [statusOptions, setStatusOptions] = useState([]);
    const [bedroomOptions, setBedroomOptions] = useState([]);
    const [bathroomOptions, setBathroomOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [neighborhoodOptions, setNeighborhoodOptions] = useState([]);
    const [TipoOptions, setTipoOptions] = useState([]);

    // For collapsing filter container on small devices
    const isSmallDevice = useMediaQuery("(max-width:600px)");
    const [expanded, setExpanded] = useState(!isSmallDevice);

    useEffect(() => {
        fetchPropiedades();
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setExpanded(!isSmallDevice);
    }, [isSmallDevice]);

    const fetchPropiedades = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/propiedades`);
            const properties = response.data;

            console.log("📢 API Response:", properties);

            if (!Array.isArray(properties)) {
                console.error("❌ API did not return an array.");
                return;
            }

            // Extract unique values for filters
            const uniqueStatus = [...new Set(properties.map(p => p.Estado))].filter(Boolean).sort();
            const uniqueBedrooms = [...new Set(properties.map(p => p.Dormitorios))].filter(Boolean).sort((a, b) => a - b);
            const uniqueBathrooms = [...new Set(properties.map(p => p.Banos))].filter(Boolean).sort((a, b) => a - b);
            const uniqueCities = [...new Set(properties.map(p => p.Ciudad))].filter(Boolean).sort();
            const uniqueNeighborhoods = [...new Set(properties.map(p => p.Barrio))].filter(Boolean).sort();
            const uniqueTipo = [...new Set(properties.map(p => p.Tipo))].filter(Boolean).sort();

            setStatusOptions(uniqueStatus);
            setBedroomOptions(uniqueBedrooms);
            setBathroomOptions(uniqueBathrooms);
            setCityOptions(uniqueCities);
            setNeighborhoodOptions(uniqueNeighborhoods);
            setTipoOptions(uniqueTipo);

            let filteredData = properties;

            // Apply Filters
            if (neighborhoodFilter.length > 0) {
                filteredData = filteredData.filter((propiedad) => neighborhoodFilter.includes(propiedad.Barrio));
            }

            if (statusFilter.length > 0) {
                filteredData = filteredData.filter((propiedad) => statusFilter.includes(propiedad.Estado));
            }

            if (cityFilter.length > 0) {
                filteredData = filteredData.filter((propiedad) => cityFilter.includes(propiedad.Ciudad));
            }

            if (bedroomFilter.length > 0) {
                filteredData = filteredData.filter((propiedad) => bedroomFilter.includes(propiedad.Dormitorios));
            }

            if (bathroomFilter.length > 0) {
                filteredData = filteredData.filter((propiedad) => bathroomFilter.includes(propiedad.Banos));
            }

            if (TipoFilter.length > 0) {
                filteredData = filteredData.filter((propiedad) => TipoFilter.includes(propiedad.Tipo));
            }

            filteredData = filteredData.filter(
                (propiedad) => propiedad.Precio >= priceRange[0] && propiedad.Precio <= priceRange[1]
            );

            // Apply Sorting
            filteredData.sort((a, b) => {
                return sortOrder === "asc"
                    ? a.Precio - b.Precio
                    : b.Precio - a.Precio;
            });

            setPropiedades(filteredData);
        } catch (error) {
            console.error("❌ Error fetching propiedades:", error);
        }
    };

    return (
        <Box>
            <Box className="title-section">
                <Typography className="title-text">Propiedades</Typography>
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
                        {[
                            { label: "Estado", value: statusFilter, setValue: setStatusFilter, options: statusOptions },
                            { label: "Tipo", value: TipoFilter, setValue: setTipoFilter, options: TipoOptions },
                            { label: "Dormitorios", value: bedroomFilter, setValue: setBedroomFilter, options: bedroomOptions },
                            { label: "Baños", value: bathroomFilter, setValue: setBathroomFilter, options: bathroomOptions },
                            { label: "Ciudad", value: cityFilter, setValue: setCityFilter, options: cityOptions },
                            { label: "Barrio", value: neighborhoodFilter, setValue: setNeighborhoodFilter, options: neighborhoodOptions }
                        ].map(({ label, value, setValue, options }) => (
                            <Box key={label} item xs={12} sm={12} md={3} className="filter-column">
                                <Typography className="filter-title">{label}</Typography>
                                <Select
                                    multiple
                                    fullWidth
                                    value={value}
                                    onChange={(e) =>
                                        setValue(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value)
                                    }
                                    className="filter-select"
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
                        {/* 🔹 Ordenar por Precio */}
                        <Box item xs={12} sm={12} md={3} className="filter-column">
                            <Box sx={{ width: "100%" }}>
                                <Typography className="filter-title">Ordenar por Precio</Typography>
                                <Select fullWidth value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-select">
                                    <MenuItem value="asc">Menor a Mayor</MenuItem>
                                    <MenuItem value="desc">Mayor a Menor</MenuItem>
                                </Select>
                            </Box>
                        </Box>
                    </Box>
                    <Box className="filter-column" sx={{ mt: 2 }}>
                        <button onClick={fetchPropiedades} className="search-button">
                            Buscar Propiedades
                        </button>
                    </Box>
                </Collapse>
            </Box>

            <Box className="property-list">
                {propiedades.length === 0 ? (
                    <Typography>No hay propiedades disponibles con los filtros seleccionados.</Typography>
                ) : (
                    propiedades.map((propiedad, index) => (
                        <Card className="property-card" key={index}>
                            <Link to={`/propiedades/${propiedad._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <CardMedia component="img" image={propiedad.Imagen} alt={propiedad.Title} />
                                <CardContent className="property-details">
                                    <Typography className="property-status">{propiedad.Estado}</Typography>
                                    <Typography className="property-price">{propiedad.Precio_Con_Formato}</Typography>
                                    <Typography className="property-barrio" variant="h6">{propiedad.Barrio}</Typography>
                                    <Typography className="property-title" variant="h6">{propiedad.Titulo}</Typography>
                                    <div className="property-icons">
                                        <span>
                                            <FaBed /> {propiedad.Dormitorios}
                                        </span>
                                        <span>
                                            <FaBath /> {propiedad.Banos}
                                        </span>
                                        <span>
                                            <FaRulerCombined /> {propiedad.Tamano_m2} m²
                                        </span>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default Propiedades;
