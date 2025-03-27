// src/pages/AdminDesarrollos.js

import React, { useEffect, useState } from "react";
import {
    Box, Button, Typography, TextField, Grid, MenuItem, Select,
    InputLabel, FormControl, Paper, FormHelperText
} from "@mui/material";
import axios from "axios";
import "../styles/Admin.css";
import BASE_URL from "../api/config";
import GaleriaEditor from "../components/admin/GaleriaEditor";
import MapSelector from "../components/admin/MapSelector";

const estadoOptions = ["Pre-Venta", "En Construcción", "A Estrenar"];

const AdminDesarrollos = () => {
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

    useEffect(() => {
        fetchDesarrollos();
    }, []);

    const fetchDesarrollos = async () => {
        const res = await axios.get(`${BASE_URL}/api/desarrollos`);
        setDesarrollos(res.data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        const requiredFields = [
            "Proyecto_Nombre", "Precio", "Estado", "Resumen", "Descripcion",
            "Ciudad", "Barrio", "Ubicacion", "Email", "Celular",
            "Entrega", "Forma_de_Pago", "Gastos_Ocupacion", "Tipo"
        ];
        const newErrors = {};
        requiredFields.forEach(field => {
            if (!form[field]) newErrors[field] = "Este campo es requerido";
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            console.warn("⚠️ El formulario no pasó la validación.");
            return;
        }

        const precioNum = Number(form.Precio);
        if (isNaN(precioNum)) {
            console.warn("⚠️ Precio inválido:", form.Precio);
            alert("El precio debe ser un número válido.");
            return;
        }

        const ubicacionFinal = typeof form.Ubicacion === "string"
            ? form.Ubicacion
            : `${form.Ubicacion.lat},${form.Ubicacion.lng}`;


        try {
            console.log("🧪 Imágenes en Galeria (pre-subida):", form.Galeria);

            const formData = new FormData();
            form.Galeria.forEach((img) => {
                if (img.file) formData.append("imagenes", img.file);
            });

            const folder = `wize/desarrollos/fotos/${form.Proyecto_Nombre}`;
            formData.append("folder", folder);

            const uploadRes = await axios.post(`${BASE_URL}/api/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (!uploadRes.data.success || !uploadRes.data.galeria) {
                console.error("❌ Cloudinary no devolvió galería válida:", uploadRes.data);
                alert("Error al subir imágenes a Cloudinary");
                return;
            }

            console.log("📸 Imágenes subidas a Cloudinary:", uploadRes.data.galeria);

            const galeriaFinal = uploadRes.data.galeria.map((img, index) => ({
                ...img,
                position: index
            }));

            const mainIndex = form.Galeria.findIndex(img => img.isMain);
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
                Ubicacion: ubicacionFinal,
                Email: form.Email,
                Celular: form.Celular,
                Entrega: form.Entrega,
                Forma_de_Pago: form.Forma_de_Pago,
                Gastos_Ocupacion: form.Gastos_Ocupacion,
                Tipo: form.Tipo,
                Imagen: imagenPrincipal,
                Galeria: galeriaFinal,
                Precio: precioNum,
                Imagen: imagenPrincipal,
                Galeria: galeriaFinal
            };

            delete payload.GaleriaPreview;

            console.log("📤 Payload final del desarrollo:", payload);
            console.log("🔍 Galeria final limpia:", galeriaFinal);
            if (editId) {
                await axios.put(`${BASE_URL}/api/desarrollos/${editId}`, payload);
                console.log("🚀 Listo para guardar el desarrollo:", payload);
                setSuccessMessage("Desarrollo actualizado con éxito.");
            } else {
                console.log("📡 Enviando a backend:", `${BASE_URL}/api/desarrollos`);

                await axios.post(`${BASE_URL}/api/desarrollos`, payload);
                setSuccessMessage("Desarrollo creado con éxito.");
            }

            console.log("✅ Desarrollo creado correctamente");
            fetchDesarrollos();
            resetForm();
        } catch (err) {
            console.error("❌ Error al guardar desarrollo:", err);
            alert("Hubo un error al guardar el desarrollo. Ver consola.");
        }
    };

    const handleGaleriaChange = (imagenes) => {
        setForm((prev) => ({ ...prev, Galeria: imagenes }));
    };

    const handleImagenPrincipalChange = (url) => {
        setForm((prev) =>
        ({
            ...prev,
            Galeria: prev.Galeria.map(img => ({
                ...img,
                isMain: img.preview === url || img.url === url
            }))
        }));
    };

    const handleEdit = (dev) => {
        let ubicacionParsed = "";
        if (dev.Ubicacion && typeof dev.Ubicacion === "string") {
            const [latStr, lngStr] = dev.Ubicacion.split(",");
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            if (!isNaN(lat) && !isNaN(lng)) {
                ubicacionParsed = { lat, lng };
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
            Ubicacion: ubicacionParsed,
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
        await axios.delete(`${BASE_URL}/api/desarrollos/${id}`);
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
    };

    return (
        <Box className="admin-main-container" p={4}>
            <Typography variant="h4" mb={4}>Admin de Desarrollos</Typography>

            <Button
                variant="outlined"
                sx={{ mb: 3 }}
                onClick={() => window.location.href = "/admin"}
            >
                ← Volver al Panel de Administración
            </Button>

            <Box component="form" onSubmit={handleSubmit} mb={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Nombre del Proyecto" name="Proyecto_Nombre" fullWidth value={form.Proyecto_Nombre} onChange={handleChange} error={!!errors.Proyecto_Nombre} helperText={errors.Proyecto_Nombre} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Precio" name="Precio" fullWidth value={form.Precio} onChange={handleChange} error={!!errors.Precio} helperText={errors.Precio} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <FormControl fullWidth error={!!errors.Estado}>
                            <InputLabel>Estado</InputLabel>
                            <Select name="Estado" value={form.Estado} onChange={handleChange} label="Estado">
                                {estadoOptions.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                            {errors.Estado && <FormHelperText>{errors.Estado}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}><TextField label="Resumen" name="Resumen" fullWidth multiline value={form.Resumen} onChange={handleChange} error={!!errors.Resumen} helperText={errors.Resumen} /></Grid>
                    <Grid item xs={12}><TextField label="Descripción" name="Descripcion" fullWidth multiline value={form.Descripcion} onChange={handleChange} error={!!errors.Descripcion} helperText={errors.Descripcion} /></Grid>
                    <Grid item xs={12}><TextField label="Descripción a Expandir" name="Descripcion_Expandir" fullWidth multiline value={form.Descripcion_Expandir} onChange={handleChange} error={!!errors.Descripcion_Expandir} helperText={errors.Descripcion_Expandir} /></Grid>

                    <Grid item xs={6} sm={4}><TextField label="Ciudad" name="Ciudad" fullWidth value={form.Ciudad} onChange={handleChange} error={!!errors.Ciudad} helperText={errors.Ciudad} /></Grid>
                    <Grid item xs={6} sm={4}><TextField label="Barrio" name="Barrio" fullWidth value={form.Barrio} onChange={handleChange} error={!!errors.Barrio} helperText={errors.Barrio} /></Grid>
                    <Grid item xs={12}>
                        <MapSelector
                            ubicacion={form.Ubicacion}
                            label="Ubicación"
                            error={!!errors.Ubicacion}
                            helperText={errors.Ubicacion}
                            setUbicacion={(loc) => handleChange({ target: { name: "Ubicacion", value: loc } })}
                        />
                    </Grid>


                    <Grid item xs={6} sm={6}><TextField label="Email" name="Email" fullWidth value={form.Email} onChange={handleChange} error={!!errors.Email} helperText={errors.Email} /></Grid>
                    <Grid item xs={6} sm={6}><TextField label="Celular" name="Celular" fullWidth value={form.Celular} onChange={handleChange} error={!!errors.Celular} helperText={errors.Celular} /></Grid>
                    <Grid item xs={6} sm={6}><TextField label="Entrega" name="Entrega" fullWidth value={form.Entrega} onChange={handleChange} error={!!errors.Entrega} helperText={errors.Entrega} /></Grid>
                    <Grid item xs={6} sm={6}><TextField label="Forma de Pago" name="Forma_de_Pago" fullWidth value={form.Forma_de_Pago} onChange={handleChange} error={!!errors.Forma_de_Pago} helperText={errors.Forma_de_Pago} /></Grid>
                    <Grid item xs={6} sm={6}><TextField label="Gastos de Ocupación" name="Gastos_Ocupacion" fullWidth value={form.Gastos_Ocupacion} onChange={handleChange} error={!!errors.Gastos_Ocupacion} helperText={errors.Gastos_Ocupacion} /></Grid>
                    <Grid item xs={6} sm={6}><TextField label="Tipo" name="Tipo" fullWidth value={form.Tipo} onChange={handleChange} error={!!errors.Tipo} helperText={errors.Tipo} /></Grid>

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
                {editId && <Button sx={{ mt: 3, ml: 2 }} onClick={resetForm}>Cancelar</Button>}
            </Box>

            <Typography variant="h5" mb={2}>Desarrollos Existentes</Typography>
            <Grid container spacing={2}>
                {desarrollos.map((dev) => (
                    <Grid item xs={12} md={6} key={dev._id}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                            <Typography variant="h6">{dev.Proyecto_Nombre}</Typography>
                            <Typography variant="body2">{dev.Resumen}</Typography>
                            <Button onClick={() => handleEdit(dev)} size="small">Editar</Button>
                            <Button onClick={() => handleDelete(dev._id)} size="small" color="error">Eliminar</Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AdminDesarrollos;
