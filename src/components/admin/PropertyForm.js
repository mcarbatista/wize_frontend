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

// Define required fields based on AdminPropiedades.js configuration.
const requiredFields = ["Titulo", "Precio", "Dormitorios", "Banos", "Tamano_m2", "DesarrolloId"];

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
        const selected = desarrollos.find((d) => d._id === form.DesarrolloId);
        if (selected) {
            setFilteredGaleria(selected.Galeria || []);

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
            handleChange({
                target: { name: "Galeria", value: selected.Galeria || [] }
            });
        } else {
            setFilteredGaleria([]);
        }
    }, [form.DesarrolloId, desarrollos, handleChange]);

    // List of other fields to render.
    const fields = [
        "Titulo", "Precio", "Dormitorios", "Banos", "Tamano_m2", "Tipo", "Metraje",
        "Piso", "Unidad", "Owner", "Celular", "Email"
    ];

    // Helper function to format labels (adding an asterisk for required fields)
    const getLabel = (field) => {
        const label =
            field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        return requiredFields.includes(field) ? `${label} *` : label;
    };

    return (
        <Box className="admin-main-container" component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <Grid container spacing={2}>
                {/* Desarrollo */}
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
                            label={getLabel(field)}
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
