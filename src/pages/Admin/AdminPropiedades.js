import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropertyCard from "../../components/admin/PropertyCard";
import PropertyForm from "../../components/admin/PropertyForm";
import PropertyNoDevForm from "../../components/admin/PropertyNoDevForm";
import LoadingIndicator from "../../components/admin/LoadingIndicator";
import "../../styles/Admin.css";
import BASE_URL from "../../api/config";
import DeleteIcon from '@mui/icons-material/Delete';

const AdminPropiedades = () => {
    document.title = "Wize | Admin Propiedades";
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [propiedades, setPropiedades] = useState([]);
    const [desarrollos, setDesarrollos] = useState([]);
    const [form, setForm] = useState({
        Titulo: "",
        Resumen: "",
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
        Celular: ""
    });
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);
    const [isFromDevelopment, setIsFromDevelopment] = useState(true);

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
    }, [[propiedades]]);

    useEffect(() => {
        if (token) {
            fetchPropiedades();
            fetchDesarrollos();
            fetchUsuarios();
        }
    }, [token]);

    const validateForm = () => {
        const newErrors = {};
        const reqFields = ["Titulo", "Precio", "Dormitorios", "Banos", "Tamano_m2", "Owner",
            ...(isFromDevelopment ? ["DesarrolloId"] : []),
        ];
        reqFields.forEach((field) => {
            if (!form[field]) newErrors[field] = "Este campo es requerido";
            console.log(`⚠️ Campo requerido faltante: ${field}`);
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchPropiedades = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/propiedades`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPropiedades(res.data);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error("Error fetching propiedades:", err);
        }
    };

    const fetchDesarrollos = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/desarrollos`, {
                headers: { Authorization: `Bearer ${token}` }
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
        console.log("🚀 handleSubmit ejecutado");

        if (!validateForm()) return;

        if (!form.Galeria.some((img) => img.isMain)) {
            alert("Debés seleccionar una imagen o video principal (haz clic en la estrella).");
            return;
        }

        const precio = Number(form.Precio);
        const tamano = Number(form.Tamano_m2);
        if (isNaN(precio) || isNaN(tamano)) {
            alert("Precio y Tamaño en m2 deben ser números.");
            return;
        }

        setIsSaving(true);

        try {
            // 🔽 Subir imágenes nuevas a Cloudinary
            const formDataImgs = new FormData();
            const folderGaleria = `wize/propiedades/fotos/${form.Proyecto_Nombre || "sin-proyecto"}`;
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

            // 🔽 Seleccionar imagen principal (solo URL)
            const mainImage = imagenesFinal.find((img) => img.isMain)?.url || "";

            // 🔽 Subir planos
            const planoFinal = [];
            for (let i = 0; i < form.Plano.length; i++) {
                const img = form.Plano[i];
                if (img.file) {
                    const fd = new FormData();
                    fd.append("folder", `wize/propiedades/planos/${form.Titulo || "plano"}`);
                    fd.append("imagenes", img.file);

                    const planoRes = await axios.post(`${BASE_URL}/api/upload`, fd, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const uploaded = planoRes.data.galeria?.[0];
                    if (uploaded) {
                        planoFinal.push({ ...uploaded, position: i });
                    }
                } else {
                    planoFinal.push({ ...img, position: i });
                }
            }

            // 🔽 Obtener Email y Celular desde el usuario (según nombre del Owner)
            const selectedOwner = usuarios.find((u) => u.nombre === form.Owner);
            const email = selectedOwner?.email || "";
            const celular = selectedOwner?.celular || "";

            // 🔽 Armar payload final
            const payload = {
                ...form,
                Precio: precio,
                Tamano_m2: tamano,
                Imagen: mainImage,
                Email: email,
                Celular: celular,
                DesarrolloId: isFromDevelopment ? form.DesarrolloId : null,
                Galeria: imagenesFinal,
                Plano: planoFinal,
            };

            console.log("🧾 Payload listo para envío:", payload);

            // 🔽 Guardar en backend
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
            Resumen: "",
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
            Celular: ""
        });
        setErrors({});
        setEditId(null);
    };

    const handleEdit = (id) => {
        navigate(`/admin/propiedades/edit/${id}`);
    };

    const handleRequestDelete = (prop) => {
        setPropertyToDelete(prop);
        setOpenConfirm(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/propiedades/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
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
            <Box className="admin-container">
                <FormControl component="fieldset" style={{ marginBottom: 20 }}>
                    <FormLabel component="legend" className="admin-subtitle">¿Pertenece a un desarrollo?</FormLabel>
                    <RadioGroup
                        row
                        value={isFromDevelopment ? "yes" : "no"}
                        onChange={(e) => setIsFromDevelopment(e.target.value === "yes")}
                    >
                        <FormControlLabel value="yes" control={<Radio />} label="Sí" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            </Box >
            {
                isFromDevelopment ? (
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
                ) : (
                    <PropertyNoDevForm
                        form={form}
                        usuarios={usuarios}
                        editId={editId}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        handleImageChange={handleImageChange}
                        errors={errors}
                        successMessage={successMessage}
                        isSaving={isSaving}
                    />
                )}

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
                        <PropertyCard
                            prop={prop}
                            onEdit={(prop) => {
                                console.log("🧪 Prop editada:", prop);
                                console.log("🧪 Prop editada:", prop);
                                console.log("🧱 DesarrolloId:", prop.DesarrolloId);
                                console.log("📦 Tipo:", typeof prop.DesarrolloId);

                                const tieneDesarrollo =
                                    typeof prop.DesarrolloId === "string" && prop.DesarrolloId.trim() !== "";

                                if (tieneDesarrollo) {
                                    navigate(`/admin/propiedades/edit/${prop}`);
                                } else {
                                    navigate(`/admin/propiedades/edit-no-dev/${prop}`);
                                }
                            }}

                            onDelete={handleRequestDelete}
                        />


                    </Grid>
                ))}
            </Box>

            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro de que desea eliminar la propiedad {propertyToDelete ? `"${propertyToDelete.Titulo}"` : ""}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
                    <Button
                        onClick={() => {
                            if (propertyToDelete?._id) {
                                handleDelete(propertyToDelete._id);
                            } else {
                                console.warn("⚠️ propertyToDelete._id es undefined");
                            }
                            setOpenConfirm(false);
                        }}
                        color="error"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        autoFocus
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default AdminPropiedades;