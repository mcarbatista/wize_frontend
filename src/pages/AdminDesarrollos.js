import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Grid,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Paper,
    FormHelperText
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/Admin.css";
import BASE_URL from "../api/config";
import GaleriaEditor from "../components/admin/GaleriaEditor";
import MapSelector from "../components/admin/MapSelector";
import RichTextInput from "../components/admin/RichTextInput";
import LoadingIndicator from "../components/admin/LoadingIndicator";

// Define the required fields for this form.
const requiredFields = [
    "Proyecto_Nombre",
    "Precio",
    "Estado",
    "Resumen",
    "Descripcion",
    "Ciudad",
    "Barrio",
    "Ubicacion",
    "Mapa",
    "Email",
    "Celular",
    "Entrega",
    "Forma_de_Pago",
    "Gastos_Ocupacion",
    "Tipo"
];

const AdminDesarrollos = () => {
    const navigate = useNavigate();
    const [desarrollos, setDesarrollos] = useState([]);
    const [form, setForm] = useState({
        Proyecto_Nombre: "",
        Precio: "",
        Estado: "",
        Resumen: "",
        Descripcion: "",
        Descripcion_Expandir: "",
        Ciudad: "",
        Barrio: "",
        Ubicacion: "",
        Mapa: "",
        Imagen: "",
        Email: "",
        Celular: "",
        Entrega: "",
        Forma_de_Pago: "",
        Gastos_Ocupacion: "",
        Tipo: "",
        Galeria: []
    });
    const [errors, setErrors] = useState({});
    const [editId, setEditId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [resetKey, setResetKey] = useState(Date.now());
    const [isSaving, setIsSaving] = useState(false);

    // Helper to append an asterisk for required fields.
    const getLabel = (field, defaultLabel) =>
        requiredFields.includes(field) ? `${defaultLabel} *` : defaultLabel;

    // Authorization check: decode token and validate expiry.
    useEffect(() => {
        document.title = "Wize | Admin Desarrollos";
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }
            // Optionally validate on the server.
            axios
                .get(`${BASE_URL}/api/admin/propiedades`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .catch((err) => {
                    if (err.response && [401, 403].includes(err.response.status)) {
                        localStorage.removeItem("token");
                        navigate("/login");
                    } else {
                        console.error("Non-auth error on protected endpoint:", err);
                    }
                });
        } catch (err) {
            console.error("Token decode error:", err);
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        fetchDesarrollos();
    }, []);

    const fetchDesarrollos = async () => {
        // Retrieve token for protected request.
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(`${BASE_URL}/api/desarrollos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDesarrollos(res.data);
        } catch (error) {
            console.error("Error fetching desarrollos:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        requiredFields.forEach((field) => {
            if (!form[field]) newErrors[field] = "Este campo es requerido";
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert(
                "El formulario no pasó la validación. Por favor, rellene todos los campos requeridos."
            );
            return;
        }

        const precioNum = Number(form.Precio);
        if (isNaN(precioNum)) {
            alert("El precio debe ser un número válido.");
            return;
        }

        const MapaFinal =
            typeof form.Mapa === "string"
                ? form.Mapa
                : `${form.Mapa.lat},${form.Mapa.lng}`;

        // Retrieve token for all protected requests.
        const token = localStorage.getItem("token");

        setIsSaving(true);
        try {
            // 1. Upload images to Cloudinary.
            const formData = new FormData();
            form.Galeria.forEach((img) => {
                if (img.file) formData.append("imagenes", img.file);
            });
            const folder = `wize/desarrollos/fotos/${form.Proyecto_Nombre}`;
            formData.append("folder", folder);

            const uploadRes = await axios.post(`${BASE_URL}/api/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!uploadRes.data.success || !uploadRes.data.galeria) {
                alert("Error al subir imágenes a Cloudinary");
                return;
            }

            const galeriaFinal = uploadRes.data.galeria.map((img, index) => ({
                ...img,
                position: index
            }));

            const mainIndex = form.Galeria.findIndex((img) => img.isMain);
            const imagenPrincipal = galeriaFinal[mainIndex]?.url || galeriaFinal[0]?.url;

            const payload = {
                Proyecto_Nombre: form.Proyecto_Nombre,
                Precio: precioNum,
                Estado: form.Estado,
                Resumen: form.Resumen,
                Descripcion: form.Descripcion,
                Descripcion_Expandir: form.Descripcion_Expandir,
                Ciudad: form.Ciudad,
                Barrio: form.Barrio,
                Ubicacion: form.Ubicacion,
                Mapa: MapaFinal,
                Email: form.Email,
                Celular: form.Celular,
                Entrega: form.Entrega,
                Forma_de_Pago: form.Forma_de_Pago,
                Gastos_Ocupacion: form.Gastos_Ocupacion,
                Tipo: form.Tipo,
                Imagen: imagenPrincipal,
                Galeria: galeriaFinal
            };

            if (editId) {
                await axios.put(`${BASE_URL}/api/desarrollos/${editId}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSuccessMessage("Desarrollo actualizado con éxito.");
            } else {
                await axios.post(`${BASE_URL}/api/desarrollos`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSuccessMessage("Desarrollo creado con éxito.");
            }

            fetchDesarrollos();
            resetForm();
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (err) {
            console.error("❌ Error al guardar desarrollo:", err);
            alert("Hubo un error al guardar el desarrollo. Ver consola.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleGaleriaChange = (imagenes) => {
        setForm((prev) => ({ ...prev, Galeria: imagenes }));
    };

    const handleImagenPrincipalChange = (url) => {
        setForm((prev) => ({
            ...prev,
            Galeria: prev.Galeria.map((img) => ({
                ...img,
                isMain: img.preview === url || img.url === url
            }))
        }));
    };

    const handleEdit = (dev) => {
        let mapaParsed = "";
        if (dev.Mapa && typeof dev.Mapa === "string") {
            const [latStr, lngStr] = dev.Mapa.split(",");
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            if (!isNaN(lat) && !isNaN(lng)) {
                mapaParsed = { lat, lng };
            }
        }

        setEditId(dev._id);
        setForm({
            Proyecto_Nombre: dev.Proyecto_Nombre || "",
            Precio: dev.Precio || "",
            Estado: dev.Estado || "",
            Resumen: dev.Resumen || "",
            Descripcion: dev.Descripcion || "",
            Descripcion_Expandir: dev.Descripcion_Expandir || "",
            Ciudad: dev.Ciudad || "",
            Barrio: dev.Barrio || "",
            Ubicacion: dev.Ubicacion || "",
            Mapa: mapaParsed,
            Imagen: dev.Imagen || "",
            Email: dev.Email || "",
            Celular: dev.Celular || "",
            Entrega: dev.Entrega || "",
            Forma_de_Pago: dev.Forma_de_Pago || "",
            Gastos_Ocupacion: dev.Gastos_Ocupacion || "",
            Tipo: dev.Tipo || "",
            Galeria: dev.Galeria || []
        });
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        await axios.delete(`${BASE_URL}/api/desarrollos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        fetchDesarrollos();
    };

    const resetForm = () => {
        setForm({
            Proyecto_Nombre: "",
            Precio: "",
            Estado: "",
            Resumen: "",
            Descripcion: "",
            Descripcion_Expandir: "",
            Ciudad: "",
            Barrio: "",
            Ubicacion: "",
            Mapa: "",
            Imagen: "",
            Email: "",
            Celular: "",
            Entrega: "",
            Forma_de_Pago: "",
            Gastos_Ocupacion: "",
            Tipo: "",
            Galeria: []
        });
        setErrors({});
        setEditId(null);
        setResetKey(Date.now());
    };

    return (
        <Box className="admin-main-container" p={4}>
            <Typography variant="h4" mb={4}>
                Admin de Desarrollos
            </Typography>

            <Button
                variant="outlined"
                sx={{ mb: 3 }}
                onClick={() => (window.location.href = "/admin")}
            >
                ← Volver al Panel de Administración
            </Button>

            <Box key={resetKey} component="form" onSubmit={handleSubmit} mb={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label={getLabel("Proyecto_Nombre", "Nombre del Proyecto")}
                            name="Proyecto_Nombre"
                            fullWidth
                            value={form.Proyecto_Nombre}
                            onChange={handleChange}
                            error={!!errors.Proyecto_Nombre}
                            helperText={errors.Proyecto_Nombre}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            label={getLabel("Precio", "Precio")}
                            name="Precio"
                            fullWidth
                            value={form.Precio}
                            onChange={handleChange}
                            error={!!errors.Precio}
                            helperText={errors.Precio}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <FormControl fullWidth error={!!errors.Estado}>
                            <InputLabel>{getLabel("Estado", "Estado")}</InputLabel>
                            <Select
                                name="Estado"
                                value={form.Estado}
                                onChange={handleChange}
                                label={getLabel("Estado", "Estado")}
                            >
                                {estadoOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.Estado && <FormHelperText>{errors.Estado}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label={getLabel("Resumen", "Resumen")}
                            name="Resumen"
                            fullWidth
                            multiline
                            value={form.Resumen}
                            onChange={handleChange}
                            error={!!errors.Resumen}
                            helperText={errors.Resumen}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <RichTextInput
                            label={getLabel("Descripcion", "Descripción")}
                            name="Descripcion"
                            value={form.Descripcion}
                            onChange={(val) =>
                                handleChange({ target: { name: "Descripcion", value: val } })
                            }
                            error={errors.Descripcion}
                            helperText={errors.Descripcion}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <RichTextInput
                            label="Descripción a Expandir"
                            name="Descripcion_Expandir"
                            value={form.Descripcion_Expandir}
                            onChange={(val) =>
                                handleChange({ target: { name: "Descripcion_Expandir", value: val } })
                            }
                            error={errors.Descripcion_Expandir}
                            helperText={errors.Descripcion_Expandir}
                        />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <TextField
                            label={getLabel("Ubicacion", "Ubicación")}
                            name="Ubicacion"
                            fullWidth
                            value={form.Ubicacion}
                            onChange={handleChange}
                            error={!!errors.Ubicacion}
                            helperText={errors.Ubicacion}
                        />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <TextField
                            label={getLabel("Ciudad", "Ciudad")}
                            name="Ciudad"
                            fullWidth
                            value={form.Ciudad}
                            onChange={handleChange}
                            error={!!errors.Ciudad}
                            helperText={errors.Ciudad}
                        />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <TextField
                            label={getLabel("Barrio", "Barrio")}
                            name="Barrio"
                            fullWidth
                            value={form.Barrio}
                            onChange={handleChange}
                            error={!!errors.Barrio}
                            helperText={errors.Barrio}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MapSelector
                            mapa={form.Mapa}
                            label={getLabel("Mapa", "Mapa")}
                            error={!!errors.Mapa}
                            helperText={errors.Mapa}
                            setMapa={(loc) =>
                                handleChange({ target: { name: "Mapa", value: loc } })
                            }
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <TextField
                            label={getLabel("Email", "Email")}
                            name="Email"
                            fullWidth
                            value={form.Email}
                            onChange={handleChange}
                            error={!!errors.Email}
                            helperText={errors.Email}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <TextField
                            label={getLabel("Celular", "Celular")}
                            name="Celular"
                            fullWidth
                            value={form.Celular}
                            onChange={handleChange}
                            error={!!errors.Celular}
                            helperText={errors.Celular}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <TextField
                            label={getLabel("Entrega", "Entrega")}
                            name="Entrega"
                            fullWidth
                            value={form.Entrega}
                            onChange={handleChange}
                            error={!!errors.Entrega}
                            helperText={errors.Entrega}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <RichTextInput
                            label={getLabel("Forma_de_Pago", "Forma de Pago")}
                            name="Forma_de_Pago"
                            value={form.Forma_de_Pago}
                            onChange={(val) =>
                                handleChange({ target: { name: "Forma_de_Pago", value: val } })
                            }
                            error={errors.Forma_de_Pago}
                            helperText={errors.Forma_de_Pago}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <TextField
                            label={getLabel("Gastos_Ocupacion", "Gastos de Ocupación")}
                            name="Gastos_Ocupacion"
                            fullWidth
                            value={form.Gastos_Ocupacion}
                            onChange={handleChange}
                            error={!!errors.Gastos_Ocupacion}
                            helperText={errors.Gastos_Ocupacion}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <FormControl fullWidth error={!!errors.Tipo}>
                            <InputLabel>{getLabel("Tipo", "Tipo")}</InputLabel>
                            <Select
                                name="Tipo"
                                value={form.Tipo}
                                onChange={handleChange}
                                label={getLabel("Tipo", "Tipo")}
                            >
                                {tipoOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.Tipo && <FormHelperText>{errors.Tipo}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <GaleriaEditor
                            imagenes={form.Galeria}
                            imagenPrincipal={form.Imagen}
                            onChange={handleGaleriaChange}
                            onMainSelect={handleImagenPrincipalChange}
                        />
                    </Grid>
                </Grid>

                <Button variant="contained" type="submit" sx={{ mt: 3 }}>
                    {editId ? "Actualizar Desarrollo" : "Crear Desarrollo"}
                </Button>
                {/* Show loading indicator while saving */}
                {isSaving && <LoadingIndicator />}
                {editId && (
                    <Button sx={{ mt: 3, ml: 2 }} onClick={resetForm}>
                        Cancelar
                    </Button>
                )}

                {successMessage && (
                    <Box mt={2}>
                        <Typography color="success.main">{successMessage}</Typography>
                    </Box>
                )}
            </Box>

            <Typography variant="h5" mb={2}>
                Desarrollos Existentes
            </Typography>
            <Grid container spacing={2}>
                {desarrollos.map((dev) => (
                    <Grid item xs={12} md={6} key={dev._id}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                            <Typography variant="h6">{dev.Proyecto_Nombre}</Typography>
                            <Typography variant="body2">{dev.Resumen}</Typography>
                            <Button onClick={() => handleEdit(dev)} size="small">
                                Editar
                            </Button>
                            <Button onClick={() => handleDelete(dev._id)} size="small" color="error">
                                Eliminar
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AdminDesarrollos;
