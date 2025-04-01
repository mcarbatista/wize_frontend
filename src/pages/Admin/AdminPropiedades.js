import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Button,
    TextField,
    MenuItem,
    Select,
    Card,
    CardMedia,
    CardContent,
    InputLabel,
    FormControl,
    FormHelperText
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import LoadingIndicator from "../../components/admin/LoadingIndicator";
import GaleriaEditorPropiedad from "../../components/admin/GaleriaEditorPropiedad";
import "../../styles/Admin.css";
import BASE_URL from "../../api/config";

// -----------------------
// PropertyForm Component
// -----------------------
const requiredFields = [
    "Titulo",
    "Precio",
    "Dormitorios",
    "Banos",
    "Tamano_m2",
    "DesarrolloId",
    "Owner"
];

const PropertyForm = ({
    form,
    desarrollos,
    usuarios,
    editId,
    handleChange,
    handleSubmit,
    handleImageChange,
    errors = {},
    successMessage
}) => {
    const [filteredGaleria, setFilteredGaleria] = useState([]);

    useEffect(() => {
        const selected = desarrollos.find((d) => d._id === form.DesarrolloId);
        if (selected) {
            setFilteredGaleria(selected.Galeria || []);

            // Update several fields from the selected desarrollo
            [
                "Resumen",
                "Descripcion",
                "Ciudad",
                "Barrio",
                "Ubicacion",
                "Estado"
            ].forEach((field) => {
                handleChange({
                    target: {
                        name: field,
                        value: selected[field] || ""
                    }
                });
            });

            // Prefill the Owner field based on desarrollo if not already set.
            if (!form.Owner && selected.Owner) {
                handleChange({
                    target: { name: "Owner", value: selected.Owner }
                });
            }

            // Also prefill Galeria (if needed)
            handleChange({
                target: { name: "Galeria", value: selected.Galeria || [] }
            });
        } else {
            setFilteredGaleria([]);
        }
    }, [form.DesarrolloId, desarrollos, handleChange, form.Owner]);

    // List of fields (excluding Owner, Email and Celular)
    const fields = [
        "Titulo",
        "Precio",
        "Dormitorios",
        "Banos",
        "Tamano_m2",
        "Tipo",
        "Metraje",
        "Piso",
        "Unidad"
    ];

    // Helper function to format labels (adding an asterisk for required fields)
    const getLabel = (field) => {
        const label = field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        return requiredFields.includes(field) ? `${label} *` : label;
    };

    return (
        <Box
            className="admin-main-container"
            component="form"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <Grid container spacing={2}>
                {/* Desarrollo Dropdown */}
                <Grid item xs={12}>
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
                            {(desarrollos || []).map((prop) => (
                                <MenuItem key={prop._id} value={prop._id}>
                                    {prop.Titulo}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.DesarrolloId && <FormHelperText>{errors.DesarrolloId}</FormHelperText>}
                    </FormControl>
                </Grid>

                {/* Render other fields */}
                {fields.map((field) => (
                    <Grid item xs={12} sm={6} key={field}>
                        <TextField
                            label={getLabel(field)}
                            name={field}
                            value={form[field] || ""}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors[field]}
                            helperText={errors[field]}
                        />
                    </Grid>
                ))}

                {/* Owner Dropdown */}
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.Owner}>
                        <InputLabel>{`Owner${requiredFields.includes("Owner") ? " *" : ""}`}</InputLabel>
                        <Select
                            name="Owner"
                            value={form.Owner || ""}
                            onChange={handleChange}
                            label={`Owner${requiredFields.includes("Owner") ? " *" : ""}`}
                        >
                            {usuarios && usuarios.length > 0 ? (
                                usuarios.map((user) => (
                                    <MenuItem key={user._id} value={user.nombre}>
                                        {user.nombre}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="">
                                    <em>No hay usuarios disponibles</em>
                                </MenuItem>
                            )}
                        </Select>
                        {errors.Owner && <FormHelperText>{errors.Owner}</FormHelperText>}
                    </FormControl>
                </Grid>

                {/* Imágenes de la propiedad */}
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
                        onChange={(imgs) => handleChange({ target: { name: "Plano", value: imgs } })}
                        imagenPrincipal={null}
                        onMainSelect={() => { }}
                    />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                    <Button variant="contained" type="submit" sx={{ mt: 3 }}>
                        {editId ? "Actualizar Propiedad" : "Crear Propiedad"}
                    </Button>
                    {successMessage && (
                        <Box mt={2} mb={2}>
                            <Typography color="success.main" variant="subtitle1">
                                {successMessage}
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

// ----------------------------
// AdminPropiedades Component
// ----------------------------
const AdminPropiedades = () => {
    document.title = "Wize | Admin Propiedades";
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
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
        Proyecto_Nombre: "",
        Imagen: "",
        ImagenPrincipal: "",
        DesarrolloId: "",
        Galeria: [],
        Plano: [],
        Email: "",
        Celular: ""
    });
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [usuarios, setUsuarios] = useState([]);

    // Check for token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            navigate("/login");
        } else {
            setToken(storedToken);
            axios
                .get(`${BASE_URL}/api/admin/propiedades`, {
                    headers: { Authorization: `Bearer ${storedToken}` }
                })
                .catch((err) => {
                    console.error("Authorization error:", err);
                    navigate("/login");
                });
        }
    }, [navigate]);

    // Fetch data after token is set
    useEffect(() => {
        if (token) {
            fetchPropiedades();
            fetchDesarrollos();
            fetchUsuarios();
        }
    }, [token]);

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ["Titulo", "Precio", "Dormitorios", "Banos", "Tamano_m2", "DesarrolloId", "Owner"];
        requiredFields.forEach((field) => {
            if (!form[field]) newErrors[field] = "Este campo es requerido";
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchPropiedades = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/propiedades`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPropiedades(res.data);
        } catch (err) {
            console.error("Error fetching propiedades:", err);
        }
    };

    const fetchDesarrollos = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/desarrollos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDesarrollos(res.data);
        } catch (err) {
            console.error("Error fetching desarrollos:", err);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/auth/usuarios`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuarios(res.data);
        } catch (err) {
            console.error("Error fetching usuarios:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // If Owner changes, update Email and Celular based on the selected user.
        if (name === "Owner") {
            const selectedOwner = usuarios.find((user) => user.nombre === value);
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

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const precio = Number(form.Precio);
        const tamano = Number(form.Tamano_m2);
        if (isNaN(precio) || isNaN(tamano)) {
            alert("Precio y Tamaño en m2 deben ser números.");
            return;
        }

        setIsSaving(true);
        try {
            // Upload Galeria images
            const formDataImgs = new FormData();
            const folderGaleria = `wize/propiedades/fotos/${form.Proyecto_Nombre}`;
            formDataImgs.append("folder", folderGaleria);
            form.Galeria.forEach((img) => {
                if (img.file) formDataImgs.append("imagenes", img.file);
            });

            const galeriaRes = await axios.post(`${BASE_URL}/api/upload`, formDataImgs, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });

            const imagenesFinal = [
                ...form.Galeria.filter((img) => !img.file),
                ...(galeriaRes.data.galeria || [])
            ].map((img, index) => ({
                ...img,
                position: index
            }));

            // Pick ImagenPrincipal if not set.
            const ImagenPrincipal = form.ImagenPrincipal || imagenesFinal[0]?.url;

            // Upload Plano images
            const planoFinal = [];
            for (let i = 0; i < form.Plano.length; i++) {
                const img = form.Plano[i];
                if (img.file) {
                    const fd = new FormData();
                    fd.append("folder", `wize/propiedades/planos/${form.Titulo}`);
                    fd.append("imagenes", img.file);

                    const planoRes = await axios.post(`${BASE_URL}/api/upload`, fd, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`
                        }
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

            // Build payload.
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
                Proyecto_Nombre: form.Proyecto_Nombre,
                Imagen: ImagenPrincipal,
                DesarrolloId: form.DesarrolloId,
                Galeria: imagenesFinal,
                Plano: planoFinal
            };

            // If an Owner is selected, verify Email and Celular are set.
            if (form.Owner) {
                if (!payload.Email || !payload.Celular) {
                    const selectedOwner = usuarios.find((user) => user.nombre === form.Owner);
                    if (selectedOwner) {
                        payload.Email = selectedOwner.email;
                        payload.Celular = selectedOwner.celular;
                    }
                }
            }

            if (editId) {
                await axios.put(`${BASE_URL}/api/propiedades/${editId}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSuccessMessage("Propiedad actualizada con éxito.");
            } else {
                await axios.post(`${BASE_URL}/api/propiedades`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSuccessMessage("Propiedad creada con éxito.");
            }

            fetchPropiedades();
            resetForm();
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (err) {
            console.error("❌ Error al guardar propiedad:", err);
            alert("Hubo un error al guardar la propiedad. Ver consola.");
        } finally {
            setIsSaving(false);
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
            Proyecto_Nombre: "",
            Imagen: "",
            ImagenPrincipal: "",
            DesarrolloId: "",
            Galeria: [],
            Plano: [],
            Email: "",
            Celular: ""
        });
        setErrors({});
        setEditId(null);
    };

    // The handleEdit function is no longer used to set local state.
    // Instead, we'll redirect to the edit form route using navigate.
    // Remove or keep this function if needed.
    // const handleEdit = (prop) => {
    //     setEditId(prop._id);
    //     setForm({
    //         Titulo: prop.Titulo || "",
    //         Descripcion: prop.Descripcion || "",
    //         Descripcion_Expandir: prop.Descripcion_Expandir || "",
    //         Precio: prop.Precio || "",
    //         Estado: prop.Estado || "",
    //         Resumen: prop.Resumen || "",
    //         Ciudad: prop.Ciudad || "",
    //         Barrio: prop.Barrio || "",
    //         Ubicacion: prop.Ubicacion || "",
    //         Tipo: prop.Tipo || "",
    //         Entrega: prop.Entrega || "",
    //         Dormitorios: prop.Dormitorios || "",
    //         Banos: prop.Banos || "",
    //         Tamano_m2: prop.Tamano_m2 || "",
    //         Metraje: prop.Metraje || "",
    //         Piso: prop.Piso || "",
    //         Unidad: prop.Unidad || "",
    //         Forma_de_Pago: prop.Forma_de_Pago || "",
    //         Gastos_Ocupacion: prop.Gastos_Ocupacion || "",
    //         Owner: prop.Owner || "",
    //         Email: prop.Email || "",
    //         Celular: prop.Celular || "",
    //         Proyecto_Nombre: prop.Proyecto_Nombre || "",
    //         Imagen: prop.Imagen || "",
    //         ImagenPrincipal: prop.Imagen || "",
    //         DesarrolloId: prop.DesarrolloId || "",
    //         Galeria: prop.Galeria || [],
    //         Plano: prop.Plano || []
    //     });
    // };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/propiedades/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchPropiedades();
        } catch (err) {
            console.error("Error deleting property:", err);
        }
    };

    return (
        <Box p={4}>
            <Typography variant="h4" mb={4} className="admin-title">
                Admin de Propiedades
            </Typography>
            <Button
                className="admin-button"
                variant="outlined"
                sx={{ mb: 3 }}
                onClick={() => (window.location.href = "/admin")}
            >
                ← Volver al Panel de Administración
            </Button>

            <PropertyForm
                form={form}
                desarrollos={desarrollos}
                usuarios={usuarios}
                editId={editId}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleImageChange={handleImageChange}
                errors={errors}
                successMessage={successMessage}
            />
            {isSaving && <LoadingIndicator />}

            <Typography variant="h5" mt={5} mb={2}>
                Propiedades Existentes
            </Typography>
            <Box
                container
                spacing={2}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 3
                }}
            >
                {propiedades.map((prop) => (
                    <Grid item xs={12} md={6} key={prop._id}>
                        <Card className="property-card-edit">
                            <CardMedia
                                component="img"
                                image={prop.Imagen}
                                alt={prop.Proyecto_Nombre}
                                sx={{ height: 200, objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography className="property-status">
                                    {prop.Estado}
                                </Typography>
                                <Typography className="property-price">
                                    Desde ${prop.Precio_Con_Formato}
                                </Typography>
                                <Typography
                                    className="property-title-desarrollos"
                                    variant="h6"
                                >
                                    {prop.Titulo}
                                </Typography>
                                <Typography className="property-barrio" variant="h6">
                                    {prop.Barrio}
                                </Typography>
                                <Typography className="desarrollo-entrega">
                                    {prop.Entrega}
                                </Typography>
                                <Button
                                    onClick={() =>
                                        navigate(`/admin/propiedades/edit/${prop._id}`)
                                    }
                                    size="small"
                                    className="admin-button-edit"
                                >
                                    Editar
                                </Button>
                                <Button
                                    onClick={() => handleDelete(prop._id)}
                                    size="small"
                                    color="error"
                                    className="admin-button-edit"
                                >
                                    Eliminar
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Box>
        </Box>
    );
};

export default AdminPropiedades;
