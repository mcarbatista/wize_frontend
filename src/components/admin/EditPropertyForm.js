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
import GaleriaEditorPropiedad from "./GaleriaEditorPropiedad";
import LoadingIndicator from "./LoadingIndicator";
import "../../styles/Admin.css";

function EditPropertyForm({
    form,
    errors,
    desarrollos,
    usuarios,
    isSaving,
    successMessage,
    onChange,
    onImageChange,
    onStarImage,
    onSubmit,
}) {
    const handleFormSubmit = (e) => {
        e.preventDefault(); // ✅ Prevenir reload del form
        onSubmit();
    };

    return (
        <Box className="admin-main-container" component="form" onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
                {[
                    "Titulo",
                    "Precio",
                    "Dormitorios",
                    "Banos",
                    "Tamano_m2",
                    "Tipo",
                    "Metraje",
                    "Piso",
                    "Unidad"
                ].map((field) => (
                    <Grid item xs={12} sm={6} key={field}>
                        <TextField
                            label={field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            name={field}
                            value={form[field] || ""}
                            onChange={onChange}
                            fullWidth
                            error={!!errors[field]}
                            helperText={errors[field]}
                        />
                    </Grid>
                ))}

                {/* Owner */}
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.Owner}>
                        <InputLabel id="owner-label">Agente</InputLabel>
                        <Select
                            labelId="owner-label"
                            name="Owner"
                            value={form.Owner || ""}
                            onChange={onChange}
                        >
                            {usuarios.map((u) => (
                                <MenuItem key={u._id} value={u._id}>
                                    {u.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.Owner}</FormHelperText>
                    </FormControl>
                </Grid>

                {/* Galería */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                        Galería
                    </Typography>
                    <GaleriaEditorPropiedad
                        imagenes={form.Galeria || []}
                        onChange={onImageChange}
                        onMainSelect={(url) =>
                            onChange({ target: { name: "Imagen", value: url } })
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
                            onChange({ target: { name: "Plano", value: imgs } })
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
                                    onChange({
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
                Actualizar Propiedad
            </Button>

            {isSaving}
            {successMessage && (
                <Box mt={2}>
                    <Typography color="success.main">{successMessage}</Typography>
                </Box>
            )}
        </Box>
    );
}

export default EditPropertyForm;
