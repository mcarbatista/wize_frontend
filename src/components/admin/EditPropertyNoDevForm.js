import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormHelperText,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { useParams } from "react-router-dom";
import GaleriaEditorPropiedad from "./GaleriaEditorPropiedad";
import RichTextInput from "./RichTextInput";
import LoadingIndicator from "./LoadingIndicator";
import axios from "axios";
import BASE_URL from "../../api/config";
import "../../styles/Admin.css";

function EditPropertyNoDevForm() {
    const { id } = useParams();
    const [form, setForm] = useState({});
    const [usuarios, setUsuarios] = useState([]);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProperty();
        fetchUsuarios();
    }, []);

    const fetchProperty = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/propiedades/${id}`);
            setForm(res.data);
        } catch (err) {
            console.error("Error fetching property:", err);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/auth/usuarios`);
            setUsuarios(res.data);
        } catch (err) {
            console.error("Error fetching usuarios:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            // Subir imágenes nuevas a Cloudinary
            const formDataImgs = new FormData();
            formDataImgs.append("folder", `wize/propiedades/fotos/${form.Titulo || "sin-titulo"}`);
            form.Galeria.forEach((img) => {
                if (img.file) formDataImgs.append("imagenes", img.file);
            });

            const galeriaRes = await axios.post(`${BASE_URL}/api/upload`, formDataImgs);
            const imagenesFinal = [
                ...form.Galeria.filter((img) => !img.file),
                ...(galeriaRes.data.galeria || []),
            ].map((img, index) => ({
                ...img,
                position: index,
            }));

            const mainImage = imagenesFinal.find((img) => img.isMain)?.url || "";

            // Subir planos en paralelo
            const planoUploads = await Promise.all(
                (form.Plano || []).map(async (img, index) => {
                    if (img.file) {
                        const fd = new FormData();
                        fd.append("folder", `wize/propiedades/planos/${form.Titulo}`);
                        fd.append("imagenes", img.file);
                        const planoRes = await axios.post(`${BASE_URL}/api/upload`, fd);
                        const uploaded = planoRes.data.galeria?.[0];
                        return uploaded ? { ...uploaded, position: index } : null;
                    } else {
                        return { ...img, position: index };
                    }
                })
            );

            const planoFinal = planoUploads.filter(Boolean);

            // Buscar email y celular del Owner
            const selectedOwner = usuarios.find((u) => u.nombre === form.Owner);
            const email = selectedOwner?.email || "";
            const celular = selectedOwner?.celular || "";

            const payload = {
                ...form,
                Precio: precio,
                Tamano_m2: tamano,
                Imagen: mainImage,
                Email: email,
                Celular: celular,
                DesarrolloId: null,
                Galeria: imagenesFinal,
                Plano: planoFinal,
            };

            console.log("✏️ Payload de edición:", payload);

            await axios.put(`${BASE_URL}/api/propiedades/${id}`, payload);
            setSuccessMessage("Propiedad actualizada con éxito.");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (err) {
            console.error("❌ Error al actualizar propiedad:", err);
            alert("Hubo un error al guardar la propiedad. Ver consola.");
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <Box className="admin-main-container" component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {["Titulo", "Precio", "Dormitorios", "Banos", "Tamano_m2", "Tipo", "Metraje", "Piso", "Unidad", "Forma_de_Pago", "Gastos_Ocupacion", "Ciudad", "Barrio", "Ubicacion", "Estado", "Entrega"].map((field) => (
                    <Grid item xs={12} sm={6} key={field}>
                        <TextField
                            label={field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            name={field}
                            value={form[field] || ""}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors[field]}
                            helperText={errors[field]}
                        />
                    </Grid>
                ))}

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.Owner}>
                        <InputLabel id="owner-label">Agente</InputLabel>
                        <Select
                            labelId="owner-label"
                            name="Owner"
                            value={form.Owner || ""}
                            onChange={handleChange}
                        >
                            {usuarios.map((u) => (
                                <MenuItem key={u._id} value={u.nombre}>
                                    {u.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.Owner}</FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item xs={12} lg={12}>
                    <RichTextInput
                        label="Resumen"
                        name="Resumen"
                        value={form.Resumen || ""}
                        onChange={(value) =>
                            handleChange({ target: { name: "Resumen", value } })
                        }
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <RichTextInput
                        label="Descripción"
                        name="Descripcion"
                        value={form.Descripcion || ""}
                        onChange={(value) =>
                            handleChange({ target: { name: "Descripcion", value } })
                        }
                    />
                </Grid>

                <Grid item xs={12}>
                    <RichTextInput
                        label="Descripción Expandida"
                        name="Descripcion_Expandir"
                        value={form.Descripcion_Expandir || ""}
                        onChange={(value) =>
                            handleChange({ target: { name: "Descripcion_Expandir", value } })
                        }
                    />
                </Grid>

                <Grid item xs={12}>
                    <GaleriaEditorPropiedad
                        imagenes={form.Galeria || []}
                        onChange={(imgs) =>
                            handleChange({ target: { name: "Galeria", value: imgs } })
                        }
                        onMainSelect={(url) =>
                            handleChange({ target: { name: "Imagen", value: url } })
                        }
                        selectedMainImage={form.Imagen}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                        Planos
                    </Typography>
                    <GaleriaEditorPropiedad
                        imagenes={form.Plano || []}
                        onChange={(imgs) =>
                            handleChange({ target: { name: "Plano", value: imgs } })
                        }
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="syncInfoCasas"
                                checked={form.syncInfoCasas || false}
                                onChange={(e) =>
                                    handleChange({
                                        target: {
                                            name: "syncInfoCasas",
                                            value: e.target.checked,
                                        },
                                    })
                                }
                            />
                        }
                        label="Sincronizar con InfoCasas"
                    />
                </Grid>
            </Grid>

            <Button
                variant="contained"
                type="submit"
                sx={{ mt: 3 }}
                disabled={isSaving}
            >
                Guardar Cambios
            </Button>

            {isSaving && <LoadingIndicator />}
            {successMessage && (
                <Box mt={2}>
                    <Typography color="success.main">{successMessage}</Typography>
                </Box>
            )}
        </Box>
    );
}

export default EditPropertyNoDevForm;
