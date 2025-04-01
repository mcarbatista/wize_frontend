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
import DeleteIcon from "@mui/icons-material/Delete";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../../styles/Admin.css";
import BASE_URL from "../../api/config";
import RichTextInput from "../../components/admin/RichTextInput";
import MapSelector from "../../components/admin/MapSelector";
import LoadingIndicator from "../../components/admin/LoadingIndicator";



// Updated inline GaleriaEditor component.
const GaleriaEditor = ({ imagenes, imagenPrincipal, onChange, onMainSelect }) => {
    const handleRemove = (index) => {
        const updated = [...imagenes];
        updated.splice(index, 1);
        onChange(updated);
    };

    const getPreviewUrl = (img) => {
        if (img.file) {
            return URL.createObjectURL(img.file);
        } else if (img.url && img.url.startsWith("http")) {
            return img.url;
        }
        return "";
    };

    return (
        <Box display="flex" flexWrap="wrap" gap={2}>
            {imagenes.map((img, index) => {
                const previewUrl = getPreviewUrl(img);
                return (
                    <Box
                        key={index}
                        sx={{
                            border: "1px solid #ccc",
                            background: "white",
                            borderRadius: 1,
                            p: 1,
                            textAlign: "center",
                            width: 120
                        }}
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt={img.alt || "Image"}
                                style={{ width: "100%", height: 100, objectFit: "cover" }}
                            />
                        ) : (
                            <Typography variant="caption">No image</Typography>
                        )}

                        <Box mt={1} display="flex" justifyContent="center" alignItems="center" >
                            <Button
                                color="#0F4C54"
                                size="small"
                                onClick={() => handleRemove(index)}
                            >
                                <DeleteIcon fontSize="small" />
                            </Button>
                            <Button
                                color="#0F4C54"
                                size="small"
                                onClick={() => onMainSelect(previewUrl)}
                            >
                                <StarBorderIcon fontSize="small" />
                            </Button>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};


const estadoOptions = ["Pre-Venta", "En Construcción", "A Estrenar"];
const tipoOptions = ["Casa", "Apartamento", "Housing"];

const EditProperty = () => {
    const { id } = useParams(); // The development ID to edit.
    const navigate = useNavigate();

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
        Mapa: {},
        Imagen: "",
        Entrega: "",
        Forma_de_Pago: "",
        Gastos_Ocupacion: "",
        Tipo: "",
        Galeria: [],
        Owner: "" // This will hold the owner's ID.
    });

    // Store the original development data.
    const [originalDev, setOriginalDev] = useState(null);
    const [errors, setErrors] = useState({});
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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
        "Owner"
    ];

    // Check for token validity on mount.
    useEffect(() => {
        document.title = "Wize | Editar Desarrollo";
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, redirecting to login.");
            navigate("/login");
            return;
        }
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                console.error("Token expired, redirecting to login.");
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }
        } catch (err) {
            console.error("Token decode error:", err);
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

    // Fetch usuarios for the Owner dropdown.
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get(`${BASE_URL}/api/auth/usuarios`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                console.log("Fetched usuarios:", res.data);
                setUsuarios(res.data);
            })
            .catch((err) => console.error("Error fetching usuarios:", err));
    }, []);

    // Fetch the development details by its ID.
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Fetching development with id:", id);
        axios
            .get(`${BASE_URL}/api/desarrollos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                console.log("Fetched development data:", res.data);
                const dev = res.data;
                // The actual development object is in dev.desarrollo
                const development = dev.desarrollo;
                let mapaParsed = {};
                if (development.Mapa && typeof development.Mapa === "string") {
                    const [latStr, lngStr] = development.Mapa.split(",");
                    const lat = parseFloat(latStr);
                    const lng = parseFloat(lngStr);
                    if (!isNaN(lat) && !isNaN(lng)) {
                        mapaParsed = { lat, lng };
                    }
                } else if (typeof development.Mapa === "object" && development.Mapa !== null) {
                    mapaParsed = development.Mapa;
                }
                setForm({
                    Proyecto_Nombre: development.Proyecto_Nombre || "",
                    Precio: development.Precio || "",
                    Estado: development.Estado || "",
                    Resumen: development.Resumen || "",
                    Descripcion: development.Descripcion || "",
                    Descripcion_Expandir: development.Descripcion_Expandir || "",
                    Ciudad: development.Ciudad || "",
                    Barrio: development.Barrio || "",
                    Ubicacion: development.Ubicacion || "",
                    Mapa: mapaParsed,
                    Imagen: development.Imagen || "",
                    Entrega: development.Entrega || "",
                    Forma_de_Pago: development.Forma_de_Pago || "",
                    Gastos_Ocupacion: development.Gastos_Ocupacion || "",
                    Tipo: development.Tipo || "",
                    Galeria: development.Galeria || [],
                    Owner: development.Owner || "" // Expecting owner ID here
                });
                setOriginalDev(development);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching development:", err);
                setIsLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleMapaChange = (loc) => {
        setForm((prev) => ({ ...prev, Mapa: loc }));
        setErrors((prev) => ({ ...prev, Mapa: "" }));
    };

    // Called when images are changed in the GaleriaEditor.
    const handleGaleriaChange = (imagenes) => {
        setForm((prev) => ({ ...prev, Galeria: imagenes }));
    };

    const handleImagenPrincipalChange = (url) => {
        setForm((prev) => ({
            ...prev,
            Galeria: prev.Galeria.map((img) => ({
                ...img,
                isMain: img.url === url || img.preview === url
            }))
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        requiredFields.forEach((field) => {
            if (
                !form[field] ||
                (typeof form[field] === "object" && Object.keys(form[field]).length === 0)
            ) {
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
        const precioNum = Number(form.Precio);
        if (isNaN(precioNum)) {
            alert("El precio debe ser un número válido.");
            return;
        }
        const token = localStorage.getItem("token");
        setIsSaving(true);
        try {
            // Upload new images (those with a .file) to Cloudinary.
            const formData = new FormData();
            // Separate new uploads from existing images.
            const existingImages = form.Galeria.filter((img) => !img.file);
            form.Galeria.forEach((img) => {
                if (img.file) {
                    formData.append("imagenes", img.file);
                }
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
                alert("Error al subir imágenes.");
                setIsSaving(false);
                return;
            }
            // Process newly uploaded images.
            const newUploads = uploadRes.data.galeria.map((uploaded, index) => ({
                alt: uploaded.original_filename || "",
                description: "",
                url: uploaded.url,
                position: index
            }));
            // Merge existing images (which already have a valid URL) with new uploads.
            const mergedGaleria = [
                ...existingImages.map((img, index) => ({ ...img, position: index })),
                ...newUploads.map((img, i) => ({
                    ...img,
                    position: existingImages.length + i
                }))
            ];
            // Determine the main image.
            let mainImg = mergedGaleria.find((img) => img.isMain);
            if (!mainImg && mergedGaleria.length > 0) {
                mainImg = mergedGaleria[0];
            }
            const imagenPrincipal = mainImg ? mainImg.url : "";

            // Build the payload.
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
                Mapa:
                    typeof form.Mapa === "string"
                        ? form.Mapa
                        : `${form.Mapa.lat},${form.Mapa.lng}`,
                Entrega: form.Entrega,
                Forma_de_Pago: form.Forma_de_Pago,
                Gastos_Ocupacion: form.Gastos_Ocupacion,
                Tipo: form.Tipo,
                Imagen: imagenPrincipal,
                Galeria: mergedGaleria
            };

            // Handle Owner: use the selected owner’s ID (stored in form.Owner) to look up full user details.
            if (form.Owner) {
                const selectedOwner = usuarios.find(
                    (user) => user._id === form.Owner
                );
                if (selectedOwner) {
                    payload.Owner = selectedOwner.nombre;
                    payload.Email = selectedOwner.email;
                    payload.Celular = selectedOwner.celular;
                }
            }

            await axios.put(`${BASE_URL}/api/desarrollos/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMessage("Desarrollo actualizado con éxito.");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (err) {
            console.error("Error al actualizar desarrollo:", err);
            alert("Error al actualizar desarrollo. Ver consola.");
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
                Editar Desarrollo
            </Typography>
            <Button
                className="admin-button"
                variant="outlined"
                sx={{ mb: 3 }}
                onClick={() => navigate("/admin/desarrollos")}
            >
                ← Volver a Desarrollos
            </Button>
            <Box className="admin-main-container" p={4}>
                <Box component="form" onSubmit={handleSubmit} mb={4}>
                    <Grid container spacing={2}>
                        {/* Proyecto_Nombre */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Proyecto_Nombre"
                                label="Nombre del Proyecto"
                                fullWidth
                                value={form.Proyecto_Nombre}
                                onChange={handleChange}
                                error={!!errors.Proyecto_Nombre}
                                helperText={errors.Proyecto_Nombre}
                            />
                        </Grid>
                        {/* Precio */}
                        <Grid item xs={6} sm={3}>
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
                        {/* Estado */}
                        <Grid item xs={6} sm={3}>
                            <FormControl fullWidth error={!!errors.Estado}>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    name="Estado"
                                    value={form.Estado}
                                    onChange={handleChange}
                                    label="Estado"
                                >
                                    {estadoOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.Estado && (
                                    <FormHelperText>{errors.Estado}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        {/* Resumen */}
                        <Grid item xs={12}>
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
                        {/* Descripcion */}
                        <Grid item xs={12}>
                            <RichTextInput
                                name="Descripcion"
                                label="Descripción"
                                value={form.Descripcion}
                                onChange={(val) =>
                                    handleChange({ target: { name: "Descripcion", value: val } })
                                }
                                error={errors.Descripcion}
                                helperText={errors.Descripcion}
                            />
                        </Grid>
                        {/* Descripcion_Expandir */}
                        <Grid item xs={12}>
                            <RichTextInput
                                name="Descripcion_Expandir"
                                label="Descripción a Expandir"
                                value={form.Descripcion_Expandir}
                                onChange={(val) =>
                                    handleChange({ target: { name: "Descripcion_Expandir", value: val } })
                                }
                                error={errors.Descripcion_Expandir}
                                helperText={errors.Descripcion_Expandir}
                            />
                        </Grid>
                        {/* Ubicacion */}
                        <Grid item xs={6} sm={4}>
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
                        {/* Ciudad */}
                        <Grid item xs={6} sm={4}>
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
                        {/* Barrio */}
                        <Grid item xs={6} sm={4}>
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
                        {/* Mapa */}
                        <Grid item xs={12}>
                            <MapSelector
                                mapa={form.Mapa}
                                label="Mapa"
                                error={!!errors.Mapa}
                                helperText={errors.Mapa}
                                setMapa={handleMapaChange}
                            />
                        </Grid>
                        {/* Owner */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                name="Owner"
                                label="Owner"
                                fullWidth
                                value={form.Owner}
                                onChange={handleChange}
                            >
                                {usuarios.map((user) => (
                                    <MenuItem key={user._id} value={user._id}>
                                        {user.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        {/* Entrega */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Entrega"
                                label="Entrega"
                                fullWidth
                                value={form.Entrega}
                                onChange={handleChange}
                                error={!!errors.Entrega}
                                helperText={errors.Entrega}
                            />
                        </Grid>
                        {/* Forma_de_Pago */}
                        <Grid item xs={12}>
                            <RichTextInput
                                name="Forma_de_Pago"
                                label="Forma de Pago"
                                value={form.Forma_de_Pago}
                                onChange={(val) =>
                                    handleChange({ target: { name: "Forma_de_Pago", value: val } })
                                }
                                error={errors.Forma_de_Pago}
                                helperText={errors.Forma_de_Pago}
                            />
                        </Grid>
                        {/* Gastos_Ocupacion */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Gastos_Ocupacion"
                                label="Gastos de Ocupación"
                                fullWidth
                                value={form.Gastos_Ocupacion}
                                onChange={handleChange}
                                error={!!errors.Gastos_Ocupacion}
                                helperText={errors.Gastos_Ocupacion}
                            />
                        </Grid>
                        {/* Tipo */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.Tipo}>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    name="Tipo"
                                    value={form.Tipo}
                                    onChange={handleChange}
                                    label="Tipo"
                                >
                                    {tipoOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.Tipo && (
                                    <FormHelperText>{errors.Tipo}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        {/* GaleriaEditor */}
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
                        Actualizar Desarrollo
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
