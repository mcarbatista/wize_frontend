import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Typography,
    Grid,
    FormHelperText
} from "@mui/material";
import GaleriaEditorPropiedad from "./GaleriaEditorPropiedad";

const PropertyForm = ({
    form,
    desarrollos,
    editId,
    handleChange,
    handleSubmit,
    handleImageChange,
    errors = {},
    successMessage
}) => {
    const [filteredGaleria, setFilteredGaleria] = useState([]);

    useEffect(() => {
        const selected = desarrollos.find(d => d._id === form.DesarrolloId);
        if (selected) {
            setFilteredGaleria(selected.Galeria || []);

            [
                "Resumen",
                "Descripcion",
                "Ciudad",
                "Barrio",
                "Ubicacion",
                "Estado"
            ].forEach(field => {
                handleChange({
                    target: {
                        name: field,
                        value: selected[field] || ""
                    }
                });
            });

            if (!form.Celular) {
                handleChange({
                    target: {
                        name: "Celular",
                        value: selected.Celular || ""
                    }
                });
            }
            if (!form.Email) {
                handleChange({
                    target: {
                        name: "Email",
                        value: selected.Email || ""
                    }
                });
            }
        } else {
            setFilteredGaleria([]);
        }
    }, [form.DesarrolloId, desarrollos]);

    const fields = [
        "Titulo", "Precio", "Dormitorios", "Banos", "Tamano_m2", "Tipo", "Metraje",
        "Piso", "Unidad", "Owner", "Celular", "Email"
    ];

    return (
        <Box className="admin-main-container" component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <Grid container spacing={2}>
                {/* Desarrollo */}
                <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors.DesarrolloId}>
                        <InputLabel>Seleccionar Desarrollo</InputLabel>
                        <Select
                            name="DesarrolloId"
                            value={form.DesarrolloId}
                            onChange={handleChange}
                            label="Seleccionar Desarrollo"
                        >
                            {(desarrollos || []).map((dev) => (
                                <MenuItem key={dev._id} value={dev._id}>
                                    {dev.Proyecto_Nombre}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.DesarrolloId && <FormHelperText>{errors.DesarrolloId}</FormHelperText>}
                    </FormControl>
                </Grid>

                {/* Campos del formulario */}
                {fields.map((field) => (
                    <Grid item xs={12} sm={6} key={field}>
                        <TextField
                            label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            name={field}
                            value={form[field] || ""}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            error={!!errors[field]}
                            helperText={errors[field]}
                        />
                    </Grid>
                ))}

                {/* Imágenes del desarrollo */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Imágenes del desarrollo</Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                        {(filteredGaleria || []).map((img, index) => (
                            <Box key={index}>
                                <img
                                    src={img.url}
                                    alt={img.alt || "imagen"}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover', borderRadius: 8 }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Grid>

                {/* Galería de propiedad */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Imágenes de la propiedad</Typography>
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
                    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Planos</Typography>
                    <GaleriaEditorPropiedad
                        imagenes={form.Plano || []}
                        onChange={(imgs) => handleChange({ target: { name: "Plano", value: imgs } })}
                        imagenPrincipal={null}
                        onMainSelect={() => { }}
                    />
                </Grid>

                {/* Botón de envío */}
                <Grid item xs={12}>
                    <Button className="admin-button" variant="contained" type="submit" sx={{ mt: 3 }}>
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

export default PropertyForm;
