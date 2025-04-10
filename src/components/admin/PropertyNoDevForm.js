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
import RichTextInput from "./RichTextInput";
import LoadingIndicator from "./LoadingIndicator";
import "../../styles/Admin.css";

function PropertyNoDevForm({
    form,
    errors,
    usuarios,
    isSaving,
    successMessage,
    handleChange,
    handleImageChange,
    handleSubmit,
}) {
    return (
        <Box className="admin-main-container" component="form" onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
        }}>
            <Grid container spacing={2}>
                {[
                    "Titulo", "Precio", "Dormitorios", "Banos", "Tamano_m2",
                    "Tipo", "Metraje", "Piso", "Unidad", "Forma_de_Pago",
                    "Gastos_Ocupacion", "Ciudad",
                    "Barrio", "Ubicacion", "Estado", "Entrega"
                ].map((field) => (
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
                        value={form.Resumen}
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
                        value={form.Descripcion}
                        onChange={(value) =>
                            handleChange({ target: { name: "Descripcion", value } })
                        }
                    />
                </Grid>

                <Grid item xs={12}>
                    <RichTextInput
                        label="Descripción Expandida"
                        name="Descripcion_Expandir"
                        value={form.Descripcion_Expandir}
                        onChange={(value) =>
                            handleChange({ target: { name: "Descripcion_Expandir", value } })
                        }
                    />
                </Grid>

                <Grid item xs={12}>
                    <GaleriaEditorPropiedad
                        imagenes={form.Galeria}
                        onChange={handleImageChange}
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
                Crear Propiedad
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

export default PropertyNoDevForm;
