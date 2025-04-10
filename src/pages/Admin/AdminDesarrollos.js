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
    Card,
    CardMedia,
    CardContent,
    FormHelperText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../../styles/Admin.css";
import "../../styles/Properties.css";
import BASE_URL from "../../api/config";
import GaleriaEditor from "../../components/admin/GaleriaEditor";
import MapSelector from "../../components/admin/MapSelector";
import RichTextInput from "../../components/admin/RichTextInput";
import LoadingIndicator from "../../components/admin/LoadingIndicator";
import DeleteIcon from '@mui/icons-material/Delete';

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
    "Entrega",
    "Forma_de_Pago",
    "Gastos_Ocupacion",
    "Tipo",
    "Owner",
];

const estadoOptions = ["Pre-Venta", "En Construcción", "A Estrenar"];
const tipoOptions = ["Casa", "Apartamento", "Housing"];

const AdminDesarrollos = () => {
    const navigate = useNavigate();
    const [desarrollos, setDesarrollos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
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
        Entrega: "",
        Forma_de_Pago: "",
        Gastos_Ocupacion: "",
        Tipo: "",
        Galeria: [],
        Owner: "",
    });
    const [errors, setErrors] = useState({});
    const [editId, setEditId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [resetKey, setResetKey] = useState(Date.now());
    const [isSaving, setIsSaving] = useState(false);

    // New state for deletion confirmation
    const [openConfirm, setOpenConfirm] = useState(false);
    const [devToDelete, setDevToDelete] = useState(null);

    // Helper to append an asterisk for required fields.
    const getLabel = (field, defaultLabel) =>
        requiredFields.includes(field) ? `${defaultLabel} *` : defaultLabel;

    // Authorization check
    useEffect(() => {
        window.scrollTo(0, 0);
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
            axios
                .get(`${BASE_URL}/api/admin/propiedades`, {
                    headers: { Authorization: `Bearer ${token}` },
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
    }, [desarrollos]);

    // Fetch desarrollos
    useEffect(() => {
        fetchDesarrollos();
    }, []);

    const fetchDesarrollos = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(`${BASE_URL}/api/desarrollos`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDesarrollos(res.data);
        } catch (error) {
            console.error("Error fetching desarrollos:", error);
        }
    };

    // Fetch usuarios for Owner dropdown
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get(`${BASE_URL}/api/auth/usuarios`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setUsuarios(res.data))
            .catch((err) => console.error("Error fetching usuarios:", err));
    }, []);

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
        // Ensure a main file is selected before proceeding.
        if (!form.Galeria.some(img => img.isMain)) {
            alert("Debés seleccionar una imagen o video principal (haz clic en la estrella).");
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

        const token = localStorage.getItem("token");
        setIsSaving(true);
        try {
            // Upload images to Cloudinary.
            const formData = new FormData();
            form.Galeria.forEach((img) => {
                if (img.file) formData.append("imagenes", img.file);
            });
            const folder = `wize/desarrollos/fotos/${form.Proyecto_Nombre}`;
            formData.append("folder", folder);

            const uploadRes = await axios.post(`${BASE_URL}/api/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!uploadRes.data.success || !uploadRes.data.galeria) {
                alert("Error al subir imágenes a Cloudinary");
                return;
            }

            const galeriaFinal = uploadRes.data.galeria.map((img, index) => ({
                ...img,
                position: index,
            }));

            const mainIndex = form.Galeria.findIndex((img) => img.isMain);
            const imagenPrincipal =
                galeriaFinal[mainIndex]?.url || galeriaFinal[0]?.url;

            // Build payload
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
                Entrega: form.Entrega,
                Forma_de_Pago: form.Forma_de_Pago,
                Gastos_Ocupacion: form.Gastos_Ocupacion,
                Tipo: form.Tipo,
                Imagen: imagenPrincipal,
                Galeria: galeriaFinal,
            };

            if (form.Owner) {
                const selectedOwner = usuarios.find((user) => user.nombre === form.Owner);
                if (selectedOwner) {
                    payload.Owner = selectedOwner.nombre;
                    payload.Email = selectedOwner.email;
                    payload.Celular = selectedOwner.celular;
                } else {
                    console.warn("No matching owner found for:", form.Owner);
                }
            }
            console.log("payload:", payload);
            if (editId) {
                await axios.put(`${BASE_URL}/api/desarrollos/${editId}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccessMessage("Desarrollo actualizado con éxito.");
            } else {
                await axios.post(`${BASE_URL}/api/desarrollos`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
                isMain: img.preview === url || img.url === url,
            })),
        }));
    };

    // Navigate to EditDevelopment.js
    const handleEdit = (dev) => {
        navigate(`/admin/desarrollos/edit/${dev._id}`);
    };

    // Updated deletion functionality with confirmation dialog.
    const confirmDelete = (id) => {
        const selectedDev = desarrollos.find((dev) => dev._id === id);
        setDevToDelete(selectedDev);
        setOpenConfirm(true);
    };

    const handleDeleteDev = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${BASE_URL}/api/desarrollos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchDesarrollos();
        } catch (err) {
            console.error("Error deleting development:", err);
        }
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
            Entrega: "",
            Forma_de_Pago: "",
            Gastos_Ocupacion: "",
            Tipo: "",
            Galeria: [],
            Owner: "",
        });
        setErrors({});
        setEditId(null);
        // Change the resetKey so that the form and child components re-mount
        setResetKey(Date.now());
    };

    return (
        <Box p={4}>
            <Typography variant="h4" mb={4} className="admin-title">
                Admin de Desarrollos
            </Typography>

            <Button
                className="admin-button"
                variant="outlined"
                sx={{ mb: 3 }}
                onClick={() => (window.location.href = "/admin")}
            >
                ← Volver al Panel de Administración
            </Button>
            <Box className="admin-main-container" p={4}>
                {/* Assign the resetKey to the form so it fully resets */}
                <Box component="form" key={resetKey} onSubmit={handleSubmit} mb={4}>
                    <Grid container spacing={2}>
                        {/* Row 1: Proyecto_Nombre, Precio, Estado */}
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

                        {/* Row 2: Resumen */}
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

                        {/* Row 3: Descripcion + Descripcion_Expandir */}
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

                        {/* Row 4: Ubicacion, Ciudad, Barrio */}
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

                        {/* Row 5: Mapa */}
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

                        {/* Row 6: Owner and Entrega */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label={getLabel("Owner", "Owner")}
                                name="Owner"
                                value={form.Owner}
                                onChange={handleChange}
                            >
                                {usuarios.map((user) => (
                                    <MenuItem key={user._id} value={user.nombre}>
                                        {user.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
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

                        {/* Row 7: Forma_de_Pago (full width) */}
                        <Grid item xs={12}>
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

                        {/* Row 8: Gastos_Ocupacion + Tipo */}
                        <Grid item xs={12} sm={6}>
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
                        <Grid item xs={12} sm={6}>
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

                        {/* Row 9: GaleriaEditor */}
                        <Grid item xs={12}>
                            <GaleriaEditor
                                key={resetKey} // key forces re-mount of GaleriaEditor
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
                <Box
                    container
                    spacing={2}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 3,
                    }}
                >
                    {desarrollos.map((dev) => (
                        <Grid item xs={12} md={6} key={dev._id}>
                            <Card className="property-card-edit">
                                <Link
                                    to={`/desarrollos/${dev._id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: "none", color: "inherit" }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={dev.Imagen}
                                        alt={dev.Proyecto_Nombre}
                                        sx={{ height: 200, objectFit: "cover" }}
                                    />
                                    <CardContent>
                                        <Typography className="property-status">{dev.Estado}</Typography>
                                        <Typography className="property-price">
                                            Desde ${dev.Precio_Con_Formato}
                                        </Typography>
                                        <Typography
                                            className="property-title-desarrollos"
                                            variant="h6"
                                            style={{ height: "90px" }}
                                        >
                                            {dev.Proyecto_Nombre}
                                        </Typography>
                                        <Typography className="property-barrio" variant="h6">
                                            {dev.Barrio}{" "}
                                        </Typography>
                                        <Typography className="desarrollo-entrega">{dev.Entrega}</Typography>
                                    </CardContent>
                                </Link>
                                <Box sx={{ display: "flex", justifyContent: "space-around", pb: 2 }}>
                                    <Button
                                        onClick={() => handleEdit(dev)}
                                        size="small"
                                        className="admin-button-edit"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        onClick={() => confirmDelete(dev._id)}
                                        color="error"
                                        variant="contained"
                                        startIcon={<DeleteIcon />}
                                        autoFocus
                                    >
                                        Eliminar
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Box>
            </Box>

            {/* Confirmation Dialog for Deletion */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro de que desea eliminar el desarrollo{" "}
                        {devToDelete ? `"${devToDelete.Proyecto_Nombre}"` : ""}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
                    <Button
                        onClick={() => {
                            handleDeleteDev(devToDelete._id);
                            setOpenConfirm(false);
                        }}
                        color="error"
                        variant="contained"
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminDesarrollos;
