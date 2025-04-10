import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropertyCard from "../../components/admin/PropertyCard";
import PropertyForm from "../../components/admin/PropertyForm";
import LoadingIndicator from "../../components/admin/LoadingIndicator";
import "../../styles/Admin.css";
import BASE_URL from "../../api/config";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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
        Celular: ""
    });
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    // State for deletion confirmation
    const [openConfirm, setOpenConfirm] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);

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

    useEffect(() => {
        if (token) {
            fetchPropiedades();
            fetchDesarrollos();
            fetchUsuarios();
        }
    }, [token]);

    const validateForm = () => {
        const newErrors = {};
        const reqFields = ["Titulo", "Precio", "Dormitorios", "Banos", "Tamano_m2", "DesarrolloId", "Owner"];
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
        console.log("🚀 handleSubmit ejecutado"); // <-- Este debería aparecer sí o sí
        if (!validateForm()) return;

        if (!form.Galeria.some(img => img.isMain)) {
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

            const mainImage = form.Imagen || imagenesFinal[0]?.url;

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
                Plano: planoFinal
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

            // 🔍 Logging útil para debug
            console.log("🧾 Payload listo para envío:", payload);
            console.log("✏️ Editando propiedad ID:", editId);

            if (editId) {
                await axios.put(`${BASE_URL}/api/propiedades/${editId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMessage("Propiedad actualizada con éxito.");
            } else {
                await axios.post(`${BASE_URL}/api/propiedades`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
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
            Celular: ""
        });
        setErrors({});
        setEditId(null);
    };

    // Updated deletion functionality with confirmation dialog.
    const handleDelete = async (id) => {
        try {
            console.log("🧨 Eliminando propiedad con ID:", id);
            await axios.delete(`${BASE_URL}/api/propiedades/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPropiedades();
        } catch (err) {
            console.error("Error deleting property:", err);
        }
    };

    const handleRequestDelete = (prop) => {
        console.log("🔍 Prop a eliminar:", prop);
        setPropertyToDelete(prop);
        setOpenConfirm(true);
    };

    const handleEdit = (id) => {
        navigate(`/admin/propiedades/edit/${id}`);
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
                        <PropertyCard prop={prop} onEdit={handleEdit} onDelete={handleRequestDelete} />
                    </Grid>
                ))}
            </Box>

            {/* Confirmation Dialog */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro de que desea eliminar la propiedad{" "}
                        {propertyToDelete ? `"${propertyToDelete.Titulo}"` : ""}?
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
                        Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPropiedades;

