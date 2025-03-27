import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Button, TextField } from "@mui/material";
import axios from "axios";

import PropertyForm from "../components/admin/PropertyForm";
import "../styles/Admin.css";
import BASE_URL from "../api/config";

const AdminPropiedades = () => {
    const [propiedades, setPropiedades] = useState([]);
    const [desarrollos, setDesarrollos] = useState([]);
    const [form, setForm] = useState({
        Titulo: "",
        Descripcion: "",
        Descripcion_Expandir: "",
        Precio: "",
        Estado: "",
        Resumen: "",
        Ciudad: "",
        Barrio: "",
        Ubicacion: "",
        Tipo: "",
        Entrega: "",
        Dormitorios: "",
        Banos: "",
        Tamano_m2: "",
        Metraje: "",
        Piso: "",
        Unidad: "",
        Forma_de_Pago: "",
        Gastos_Ocupacion: "",
        Owner: "",
        Celular: "",
        Email: "",
        Proyecto_Nombre: "",
        Imagen: "",
        ImagenPrincipal: "",
        DesarrolloId: "",
        Galeria: [],
        Plano: []
    });
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchPropiedades();
        fetchDesarrollos();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ["Titulo", "Precio", "Dormitorios", "Banos", "Tamano_m2", "DesarrolloId"];
        requiredFields.forEach(field => {
            if (!form[field]) newErrors[field] = "Este campo es requerido";
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchPropiedades = async () => {
        const res = await axios.get(`${BASE_URL}/api/propiedades`);
        setPropiedades(res.data);
    };

    const fetchDesarrollos = async () => {
        const res = await axios.get(`${BASE_URL}/api/desarrollos`);
        setDesarrollos(res.data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (Galeria) => {
        setForm(prev => ({ ...prev, Galeria }));
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const precio = Number(form.Precio);
        const tamano = Number(form.Tamano_m2);
        if (isNaN(precio) || isNaN(tamano)) {
            alert("Precio y Tamaño en m2 deben ser números.");
            return;
        }

        try {
            const formDataImgs = new FormData();
            const folderGaleria = `wize/propiedades/fotos/${form.Proyecto_Nombre}`;
            formDataImgs.append("folder", folderGaleria);
            form.Galeria.forEach((img) => {
                if (img.file) formDataImgs.append("imagenes", img.file);
            });

            const galeriaRes = await axios.post(`${BASE_URL}/api/upload`, formDataImgs, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const imagenesFinal = [
                ...form.Galeria.filter((img) => !img.file),
                ...(galeriaRes.data.galeria || [])
            ].map((img, index) => ({
                ...img,
                position: index
            }));

            const ImagenPrincipal = form.ImagenPrincipal || imagenesFinal[0]?.url;

            const planoFinal = [];
            for (let i = 0; i < form.Plano.length; i++) {
                const img = form.Plano[i];
                if (img.file) {
                    const fd = new FormData();
                    fd.append("folder", `wize/propiedades/planos/${form.Titulo}`);
                    fd.append("imagenes", img.file);

                    const planoRes = await axios.post(`${BASE_URL}/api/upload`, fd, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });

                    const uploaded = planoRes.data.galeria?.[0];
                    if (uploaded) {
                        planoFinal.push({
                            ...uploaded,
                            position: i
                        });
                    }
                } else {
                    planoFinal.push({
                        ...img,
                        position: i
                    });
                }
            }

            const payload = {
                Titulo: form.Titulo,
                Descripcion: form.Descripcion,
                Descripcion_Expandir: form.Descripcion_Expandir,
                Precio: precio,
                Estado: form.Estado,
                Dormitorios: form.Dormitorios,
                Banos: form.Banos,
                Tamano_m2: tamano,
                Tipo: form.Tipo,
                Entrega: form.Entrega,
                Metraje: form.Metraje,
                Piso: form.Piso,
                Unidad: form.Unidad,
                Forma_de_Pago: form.Forma_de_Pago,
                Gastos_Ocupacion: form.Gastos_Ocupacion,
                Owner: form.Owner,
                Celular: form.Celular,
                Email: form.Email,
                Proyecto_Nombre: form.Proyecto_Nombre,
                Imagen: ImagenPrincipal,
                DesarrolloId: form.DesarrolloId,
                Galeria: imagenesFinal,
                Plano: planoFinal
            };

            console.log("📤 Payload final:", payload);

            if (editId) {
                await axios.put(`${BASE_URL}/api/propiedades/${editId}`, payload);
                setSuccessMessage("Propiedad actualizada con éxito.");
            } else {
                await axios.post(`${BASE_URL}/api/propiedades`, payload);
                setSuccessMessage("Propiedad creada con éxito.");
            }

            fetchPropiedades();
            resetForm();
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (err) {
            console.error("❌ Error al guardar propiedad:", err);
            alert("Hubo un error al guardar la propiedad. Ver consola.");
        }
    };

    const resetForm = () => {
        setForm({
            Titulo: "",
            Descripcion: "",
            Descripcion_Expandir: "",
            Precio: "",
            Estado: "",
            Resumen: "",
            Ciudad: "",
            Barrio: "",
            Ubicacion: "",
            Tipo: "",
            Entrega: "",
            Dormitorios: "",
            Banos: "",
            Tamano_m2: "",
            Metraje: "",
            Piso: "",
            Unidad: "",
            Forma_de_Pago: "",
            Gastos_Ocupacion: "",
            Owner: "",
            Celular: "",
            Email: "",
            Proyecto_Nombre: "",
            Imagen: "",
            ImagenPrincipal: "",
            DesarrolloId: "",
            Galeria: [],
            Plano: []
        });
        setErrors({});
        setEditId(null);
    };

    const handleEdit = (prop) => {
        setEditId(prop._id);
        setForm({
            Titulo: prop.Titulo || "",
            Descripcion: prop.Descripcion || "",
            Descripcion_Expandir: prop.Descripcion_Expandir || "",
            Precio: prop.Precio || "",
            Estado: prop.Estado || "",
            Resumen: prop.Resumen || "",
            Ciudad: prop.Ciudad || "",
            Barrio: prop.Barrio || "",
            Ubicacion: prop.Ubicacion || "",
            Tipo: prop.Tipo || "",
            Entrega: prop.Entrega || "",
            Dormitorios: prop.Dormitorios || "",
            Banos: prop.Banos || "",
            Tamano_m2: prop.Tamano_m2 || "",
            Metraje: prop.Metraje || "",
            Piso: prop.Piso || "",
            Unidad: prop.Unidad || "",
            Forma_de_Pago: prop.Forma_de_Pago || "",
            Gastos_Ocupacion: prop.Gastos_Ocupacion || "",
            Owner: prop.Owner || "",
            Celular: prop.Celular || "",
            Email: prop.Email || "",
            Proyecto_Nombre: prop.Proyecto_Nombre || "",
            Imagen: prop.Imagen || "",
            ImagenPrincipal: prop.Imagen || "",
            DesarrolloId: prop.DesarrolloId || "",
            Galeria: prop.Galeria || [],
            Plano: prop.Plano || [],
        });
    };


    const handleDelete = async (id) => {
        await axios.delete(`${BASE_URL}/api/propiedades/${id}`);
        fetchPropiedades();
    };

    return (
        <Box p={4}>
            <Typography variant="h4" mb={4}>Admin de Propiedades</Typography>
            <Button variant="outlined" sx={{ mb: 3 }} onClick={() => window.location.href = "/admin"}>
                ← Volver al Panel de Administración
            </Button>
            <PropertyForm
                form={form}
                desarrollos={desarrollos}
                editId={editId}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleImageChange={handleImageChange}
                errors={errors}
                successMessage={successMessage}
            />
            <Grid container spacing={2} mt={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Estado del Desarrollo"
                        value={form.Estado}
                        InputProps={{ readOnly: true }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Barrio del Desarrollo"
                        value={form.Barrio}
                        InputProps={{ readOnly: true }}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Typography variant="h5" mt={5} mb={2}>Propiedades Existentes</Typography>
            <Grid container spacing={2}>
                {propiedades.map((prop) => (
                    <Grid item xs={12} md={6} key={prop._id}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                            <Typography variant="h6">{prop.Titulo}</Typography>
                            <Typography variant="body2">{prop.Barrio} - {prop.Precio}</Typography>
                            <Button onClick={() => handleEdit(prop)} size="small">Editar</Button>
                            <Button onClick={() => handleDelete(prop._id)} size="small" color="error">Eliminar</Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AdminPropiedades;