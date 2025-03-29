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
const requiredFields = ["Titulo", "Precio", "Dormitorios", "Banos", "Tamano_m2", "DesarrolloId", "Owner"];

const PropertyForm = ({
    form,
    desarrollos,
    usuarios, // new prop: list of usuarios for the Owner dropdown
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
        "Titulo", "Precio", "Dormitorios", "Banos", "Tamano_m2", "Tipo", "Metraje",
        "Piso", "Unidad"
    ];

    // Helper function to format labels (adding an asterisk for required fields)
    const getLabel = (field) => {
        const label = field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        return requiredFields.includes(field) ? `${label} *` : label;
    };

    return (
        <Box className="admin-main-container" component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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
                            {(desarrollos || []).map((dev) => (
                                <MenuItem key={dev._id} value={dev._id}>
                                    {dev.Proyecto_Nombre}
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
