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
    FormHelperText
} from "@mui/material";
import RichTextInput from "../../components/admin/RichTextInput";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../api/config";
import LoadingIndicator from "../../components/admin/LoadingIndicator";
import GaleriaEditorPropiedad from "../../components/admin/GaleriaEditorPropiedad";
import "../../styles/Admin.css";

const requiredFields = [
    "Titulo",
    "Precio",
    "Dormitorios",
    "Banos",
    "Tamano_m2",
    "DesarrolloId",
    "Owner"
];

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();

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
        Proyecto_Nombre: "",
        Imagen: "",
        ImagenPrincipal: "",
        DesarrolloId: "",
        Galeria: [],
        Plano: [],
        Email: "",
        Celular: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [desarrollos, setDesarrollos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    // Check for token, fetch usuarios, desarrollos and the property details.
    useEffect(() => {
        document.title = "Wize | Editar Propiedad";
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        // Fetch usuarios for the Owner dropdown.
        axios
            .get(`${BASE_URL}/api/auth/usuarios`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                setUsuarios(res.data);
            })
            .catch((err) => console.error("Error fetching usuarios:", err));

        // Fetch desarrollos for the Desarrollo dropdown.
        axios
            .get(`${BASE_URL}/api/desarrollos`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                setDesarrollos(res.data);
            })
            .catch((err) => console.error("Error fetching desarrollos:", err));

        // Fetch property details.
        axios
            .get(`${BASE_URL}/api/propiedades/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                const prop = res.data;
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
                    Proyecto_Nombre: prop.Proyecto_Nombre || "",
                    Imagen: prop.Imagen || "",
                    ImagenPrincipal: prop.ImagenPrincipal || "",
                    DesarrolloId: prop.DesarrolloId || "",
                    Galeria: prop.Galeria || [],
                    Plano: prop.Plano || [],
                    Email: prop.Email || "",
                    Celular: prop.Celular || ""
                });
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching property details:", err);
                setIsLoading(false);
            });
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // If Owner changes, update Email and Celular.
        if (name === "Owner") {
            const selectedOwner = usuarios.find((user) => user._id === value);
            if (selectedOwner) {
                setForm((prev) => ({
                    ...prev,
                    Owner: value,
                    Email: selectedOwner.email,
                    Celular: selectedOwner.celular
                }));
            } else {
                setForm((prev) => ({ ...prev, Owner: value }));
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleImageChange = (Galeria) => {
        setForm((prev) => ({ ...prev, Galeria }));
    };

    const validateForm = () => {
        const newErrors = {};
        requiredFields.forEach((field) => {
            if (!form[field]) {
                newErrors[field] = "Este campo es requerido";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert("Por favor complete los campos requeridos.");
            return;
        }
        const token = localStorage.getItem("token");
        setIsSaving(true);
        try {
            // Process new image uploads (images with a .file property)
            const formData = new FormData();
            const folderGaleria = `wize/propiedades/fotos/${form.Titulo}`;
            formData.append("folder", folderGaleria);
            form.Galeria.forEach((img) => {
                if (img.file) {
                    formData.append("imagenes", img.file);
                }
            });

            let updatedGaleria = [];
            if (formData.has("imagenes")) {
                const uploadRes = await axios.post(`${BASE_URL}/api/upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                });
                const uploaded = uploadRes.data.galeria;
                updatedGaleria = [
                    ...form.Galeria.filter((img) => !img.file),
                    ...(uploaded || []).map((img, index) => ({ ...img, position: index }))
                ];
            } else {
                updatedGaleria = form.Galeria;
            }

            // Determine the main image for the property.
            let mainImg = updatedGaleria.find((img) => img.isMain);
            if (!mainImg && updatedGaleria.length > 0) {
                mainImg = updatedGaleria[0];
            }
            const imagenPrincipal = mainImg ? mainImg.url : "";

            // Build the payload.
            const payload = {
                Titulo: form.Titulo,
                Descripcion: form.Descripcion,
                Descripcion_Expandir: form.Descripcion_Expandir,
                Precio: Number(form.Precio),
                Estado: form.Estado,
                Resumen: form.Resumen,
                Ciudad: form.Ciudad,
                Barrio: form.Barrio,
                Ubicacion: form.Ubicacion,
                Tipo: form.Tipo,
                Entrega: form.Entrega,
                Dormitorios: form.Dormitorios,
                Banos: form.Banos,
                Tamano_m2: form.Tamano_m2,
                Metraje: form.Metraje,
                Piso: form.Piso,
                Unidad: form.Unidad,
                Forma_de_Pago: form.Forma_de_Pago,
                Gastos_Ocupacion: form.Gastos_Ocupacion,
                Owner: form.Owner,
                Email: form.Email,
                Celular: form.Celular,
                Proyecto_Nombre: form.Proyecto_Nombre,
                Imagen: imagenPrincipal,
                DesarrolloId: form.DesarrolloId,
                Galeria: updatedGaleria,
                Plano: form.Plano
            };

            await axios.put(`${BASE_URL}/api/propiedades/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMessage("Propiedad actualizada con éxito.");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (err) {
            console.error("Error al actualizar propiedad:", err);
            alert("Error al actualizar propiedad. Ver consola.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <Box p={4}>
            <Typography variant="h4" mb={4} className="admin-title">
                Editar Propiedad
            </Typography>
            <Button
                className="admin-button"
                variant="outlined"
                sx={{ mb: 3 }}
                onClick={() => navigate("/admin/propiedades")}
            >
                ← Volver a Propiedades
            </Button>
            <Box className="admin-main-container" p={4}>
                <Box component="form" onSubmit={handleSubmit} mb={4}>
                    <Grid container spacing={2}>
                        {/* Título */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Titulo"
                                label="Título"
                                fullWidth
                                value={form.Titulo}
                                onChange={handleChange}
                                error={!!errors.Titulo}
                                helperText={errors.Titulo}
                            />
                        </Grid>
                        {/* Precio */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Precio"
                                label="Precio"
                                fullWidth
                                value={form.Precio}
                                onChange={handleChange}
                                error={!!errors.Precio}
                                helperText={errors.Precio}
                            />
                        </Grid>
                        {/* Dormitorios */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Dormitorios"
                                label="Dormitorios"
                                fullWidth
                                value={form.Dormitorios}
                                onChange={handleChange}
                                error={!!errors.Dormitorios}
                                helperText={errors.Dormitorios}
                            />
                        </Grid>
                        {/* Baños */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Banos"
                                label="Baños"
                                fullWidth
                                value={form.Banos}
                                onChange={handleChange}
                                error={!!errors.Banos}
                                helperText={errors.Banos}
                            />
                        </Grid>
                        {/* Tamaño (m²) */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Tamano_m2"
                                label="Tamaño (m²)"
                                fullWidth
                                value={form.Tamano_m2}
                                onChange={handleChange}
                                error={!!errors.Tamano_m2}
                                helperText={errors.Tamano_m2}
                            />
                        </Grid>
                        {/* Tipo */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Tipo"
                                label="Tipo"
                                fullWidth
                                value={form.Tipo}
                                onChange={handleChange}
                                error={!!errors.Tipo}
                                helperText={errors.Tipo}
                            />
                        </Grid>
                        {/* Desarrollo Dropdown */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.DesarrolloId}>
                                <InputLabel>
                                    {`Seleccionar Desarrollo${requiredFields.includes("DesarrolloId") ? " *" : ""}`}
                                </InputLabel>
                                <Select
                                    name="DesarrolloId"
                                    value={form.DesarrolloId}
                                    onChange={handleChange}
                                    label={`Seleccionar Desarrollo${requiredFields.includes("DesarrolloId") ? " *" : ""}`}
                                >
                                    {desarrollos.map((prop) => (
                                        <MenuItem key={prop._id} value={prop._id}>
                                            {prop.Proyecto_Nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.DesarrolloId && (
                                    <FormHelperText>{errors.DesarrolloId}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        {/* Owner Dropdown */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.Owner}>
                                <InputLabel>{`Owner${requiredFields.includes("Owner") ? " *" : ""}`}</InputLabel>
                                <Select
                                    name="Owner"
                                    value={form.Owner}
                                    onChange={handleChange}
                                    label={`Owner${requiredFields.includes("Owner") ? " *" : ""}`}
                                >
                                    {usuarios.map((user) => (
                                        <MenuItem key={user._id} value={user._id}>
                                            {user.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.Owner && (
                                    <FormHelperText>{errors.Owner}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        {/* Descripción */}
                        <Grid item xs={12}>
                            <RichTextInput
                                name="Descripcion"
                                label="Descripción"
                                fullWidth
                                multiline
                                value={form.Descripcion}
                                onChange={(newValue) =>
                                    handleChange({
                                        target: { name: "Descripcion", value: newValue }
                                    })
                                }
                                error={!!errors.Descripcion}
                                helperText={errors.Descripcion}
                            />
                        </Grid>
                        {/* Descripción Expandida */}
                        <Grid item xs={12}>
                            <RichTextInput
                                name="Descripcion_Expandir"
                                label="Descripción Expandida"
                                fullWidth
                                multiline
                                value={form.Descripcion_Expandir}
                                onChange={(newValue) =>
                                    handleChange({
                                        target: { name: "Descripcion_Expandir", value: newValue }
                                    })
                                }
                                error={!!errors.Descripcion_Expandir}
                                helperText={errors.Descripcion_Expandir}
                            />
                        </Grid>
                        {/* Estado, Resumen, Ciudad, Barrio y Ubicación */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Estado"
                                label="Estado"
                                fullWidth
                                value={form.Estado}
                                onChange={handleChange}
                                error={!!errors.Estado}
                                helperText={errors.Estado}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Resumen"
                                label="Resumen"
                                fullWidth
                                multiline
                                value={form.Resumen}
                                onChange={handleChange}
                                error={!!errors.Resumen}
                                helperText={errors.Resumen}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Ciudad"
                                label="Ciudad"
                                fullWidth
                                value={form.Ciudad}
                                onChange={handleChange}
                                error={!!errors.Ciudad}
                                helperText={errors.Ciudad}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Barrio"
                                label="Barrio"
                                fullWidth
                                value={form.Barrio}
                                onChange={handleChange}
                                error={!!errors.Barrio}
                                helperText={errors.Barrio}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="Ubicacion"
                                label="Ubicación"
                                fullWidth
                                value={form.Ubicacion}
                                onChange={handleChange}
                                error={!!errors.Ubicacion}
                                helperText={errors.Ubicacion}
                            />
                        </Grid>
                        {/* Galería de Imágenes */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                                Imágenes de la propiedad
                            </Typography>
                            <GaleriaEditorPropiedad
                                imagenes={form.Galeria || []}
                                onChange={handleImageChange}
                                imagenPrincipal={form.Imagen}
                                onMainSelect={(url) =>
                                    handleChange({ target: { name: "Imagen", value: url } })
                                }
                            />
                        </Grid>
                        {/* Planos */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                                Planos
                            </Typography>
                            <GaleriaEditorPropiedad
                                imagenes={form.Plano || []}
                                onChange={(imgs) =>
                                    handleChange({ target: { name: "Plano", value: imgs } })
                                }
                                imagenPrincipal={null}
                                onMainSelect={() => { }}
                            />
                        </Grid>
                    </Grid>
                    <Button variant="contained" type="submit" sx={{ mt: 3 }}>
                        Actualizar Propiedad
                    </Button>
                    {isSaving && <LoadingIndicator />}
                    {successMessage && (
                        <Box mt={2}>
                            <Typography color="success.main">{successMessage}</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default EditProperty;
