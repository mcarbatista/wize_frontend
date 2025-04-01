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
    FormHelperText,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import LoadingIndicator from "../../components/admin/LoadingIndicator";
import GaleriaEditorPropiedad from "../../components/admin/GaleriaEditorPropiedad";
import "../../styles/Admin.css";
import BASE_URL from "../../api/config";

const requiredFields = [
    "Titulo",
    "Precio",
    "Dormitorios",
    "Banos",
    "Tamano_m2",
    "DesarrolloId",
    "Owner",
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
    successMessage,
}) => {
    // We keep a filtered gallery (if needed for display) but also
    // auto-prefill the property gallery from the selected development if empty.
    const [filteredGaleria, setFilteredGaleria] = useState([]);

    // Update filteredGaleria to the development's gallery (for display, if desired)
    useEffect(() => {
        const selected = desarrollos.find((d) => d._id === form.DesarrolloId);
        if (selected) {
            setFilteredGaleria(selected.Galeria || []);
        } else {
            setFilteredGaleria([]);
        }
    }, [form.DesarrolloId, desarrollos]);

    // Prefill the property gallery with the development's gallery if it is empty.
    useEffect(() => {
        const selected = desarrollos.find((d) => d._id === form.DesarrolloId);
        if (selected && (!form.Galeria || form.Galeria.length === 0)) {
            handleChange({
                target: { name: "Galeria", value: selected.Galeria || [] },
            });
        }
    }, [form.DesarrolloId, desarrollos]); // Note: This runs only when DesarrolloId changes.

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
        "Unidad",
    ];

    // Helper function to format labels (adding an asterisk for required fields)
    const getLabel = (field) =>
        field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) +
        (requiredFields.includes(field) ? " *" : "");

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
                            {`Seleccionar Desarrollo${requiredFields.includes("DesarrolloId") ? " *" : ""
                                }`}
                        </InputLabel>
                        <Select
                            name="DesarrolloId"
                            value={form.DesarrolloId}
                            onChange={handleChange}
                            label={`Seleccionar Desarrollo${requiredFields.includes("DesarrolloId") ? " *" : ""
                                }`}
                        >
                            {(desarrollos || []).map((dev) => (
                                <MenuItem key={dev._id} value={dev._id}>
                                    {dev.Proyecto_Nombre}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.DesarrolloId && (
                            <FormHelperText>{errors.DesarrolloId}</FormHelperText>
                        )}
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
                        <InputLabel>
                            {`Owner${requiredFields.includes("Owner") ? " *" : ""}`}
                        </InputLabel>
                        <Select
                            name="Owner"
                            value={form.Owner || ""}
                            onChange={handleChange}
                            label={`Owner${requiredFields.includes("Owner") ? " *" : ""}`}
                        >
                            {usuarios && usuarios.length > 0 ? (
                                usuarios.map((user) => (
                                    <MenuItem key={user._id} value={user._id}>
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
                        onMainSelect={(url) =>
                            handleChange({ target: { name: "Imagen", value: url } })
                        }
                        selectedMainImage={form.Imagen}
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
        DesarrolloId: "",
        Galeria: [],
        Plano: [],
        Email: "",
        Celular: "",
    });
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            navigate("/login");
        } else {
            setToken(storedToken);
            axios
                .get(`${BASE_URL}/api/admin/propiedades`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                })
                .catch((err) => {
                    console.error("Authorization error:", err);
                    navigate("/login");
                });
        }
    }, [navigate]);

    useEffect(() => {
        if (token) {
            fetchPropiedades();
            fetchDesarrollos();
            fetchUsuarios();
        }
    }, [token]);

    const validateForm = () => {
        const newErrors = {};
        const reqFields = [
            "Titulo",
            "Precio",
            "Dormitorios",
            "Banos",
            "Tamano_m2",
            "DesarrolloId",
            "Owner",
        ];
        reqFields.forEach((field) => {
            if (!form[field]) newErrors[field] = "Este campo es requerido";
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchPropiedades = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/propiedades`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPropiedades(res.data);
        } catch (err) {
            console.error("Error fetching propiedades:", err);
        }
    };

    const fetchDesarrollos = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/desarrollos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDesarrollos(res.data);
        } catch (err) {
            console.error("Error fetching desarrollos:", err);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/auth/usuarios`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsuarios(res.data);
        } catch (err) {
            console.error("Error fetching usuarios:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "Owner") {
            const selectedOwner = usuarios.find((user) => user.nombre === value);
            if (selectedOwner) {
                setForm((prev) => ({
                    ...prev,
                    Owner: value,
                    Email: selectedOwner.email,
                    Celular: selectedOwner.celular,
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
                    Authorization: `Bearer ${token}`,
                },
            });

            const imagenesFinal = [
                ...form.Galeria.filter((img) => !img.file),
                ...(galeriaRes.data.galeria || []),
            ].map((img, index) => ({
                ...img,
                position: index,
            }));

            // Determine the main image – use form.Imagen if set, else default to the first image
            const mainImage = form.Imagen || imagenesFinal[0]?.url;

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
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const uploaded = planoRes.data.galeria?.[0];
                    if (uploaded) {
                        planoFinal.push({
                            ...uploaded,
                            position: i,
                        });
                    }
                } else {
                    planoFinal.push({
                        ...img,
                        position: i,
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
                Email: form.Email,
                Celular: form.Celular,
                Proyecto_Nombre: form.Proyecto_Nombre,
                Imagen: mainImage,
                DesarrolloId: form.DesarrolloId,
                Galeria: imagenesFinal,
                Plano: planoFinal,
            };

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
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuccessMessage("Propiedad actualizada con éxito.");
            } else {
                await axios.post(`${BASE_URL}/api/propiedades`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
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
            DesarrolloId: "",
            Galeria: [],
            Plano: [],
            Email: "",
            Celular: "",
        });
        setErrors({});
        setEditId(null);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/propiedades/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
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
                    gap: 3,
                }}
            >
                {propiedades.map((prop) => (
                    <Grid item xs={12} md={6} key={prop._id}>
                        <Card className="property-card-edit">
                            <Link to={`/propiedades/${prop._id}`} style={{ textDecoration: "none", color: "inherit" }}>
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
                                        ${prop.Precio_Con_Formato}
                                    </Typography>
                                    <Typography
                                        className="property-title-desarrollos"
                                        variant="h6" style={{ height: "90px" }}
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
                                        onClick={() => navigate(`/admin/propiedades/edit/${prop._id}`)}
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
                            </Link>
                        </Card>
                    </Grid>
                ))}
            </Box>
        </Box>
    );
};

export default AdminPropiedades;
