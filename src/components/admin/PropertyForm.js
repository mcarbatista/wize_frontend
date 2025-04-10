import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormHelperText,
    Checkbox, FormControlLabel
} from "@mui/material";
import GaleriaEditorPropiedad from "../../components/admin/GaleriaEditorPropiedad";
import "../../styles/Admin.css";

const requiredFields = [
    "Titulo",
    "Precio",
    "Dormitorios",
    "Banos",
    "Tamano_m2",
    "DesarrolloId",
    "Owner",
    // "Barrio",
    // "Ciudad"
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
    // We keep a filtered gallery for display and also auto-prefill the property gallery
    // from the selected development if empty.
    const [filteredGaleria, setFilteredGaleria] = useState([]);

    useEffect(() => {
        const selected = desarrollos.find((d) => d._id === form.DesarrolloId);
        if (selected) {
            setFilteredGaleria(selected.Galeria || []);
        } else {
            setFilteredGaleria([]);
        }
    }, [form.DesarrolloId, desarrollos]);

    // Auto-fill property gallery if empty
    useEffect(() => {
        const selected = desarrollos.find((d) => d._id === form.DesarrolloId);
        if (selected && (!form.Galeria || form.Galeria.length === 0)) {
            handleChange({
                target: { name: "Galeria", value: selected.Galeria || [] }
            });
        }
    }, [form.DesarrolloId, desarrollos, handleChange]);

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

                {/* Imágenes/Videos de la propiedad */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                        Imágenes / Videos de la propiedad
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
                {/* Checkbox: Sincronizar con InfoCasas */}
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
                                            value: e.target.checked
                                        }
                                    })
                                }
                            />
                        }
                        label="Sincronizar con InfoCasas"
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

export default PropertyForm;