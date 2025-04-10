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
import RichTextInput from "./RichTextInput";
import GaleriaEditorPropiedad from "./GaleriaEditorPropiedad";
import LoadingIndicator from "./LoadingIndicator";

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
    return (
        <Box component="form" onSubmit={onSubmit}>
            <Grid container spacing={2}>
                {/* Título */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Título"
                        name="Titulo"
                        value={form.Titulo}
                        onChange={onChange}
                        fullWidth
                        error={!!errors.Titulo}
                        helperText={errors.Titulo}
                    />
                </Grid>

                {/* Precio */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Precio"
                        name="Precio"
                        type="number"
                        value={form.Precio}
                        onChange={onChange}
                        fullWidth
                        error={!!errors.Precio}
                        helperText={errors.Precio}
                    />
                </Grid>

                {/* Dormitorios */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Dormitorios"
                        name="Dormitorios"
                        type="number"
                        value={form.Dormitorios}
                        onChange={onChange}
                        fullWidth
                        error={!!errors.Dormitorios}
                        helperText={errors.Dormitorios}
                    />
                </Grid>

                {/* Baños */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Baños"
                        name="Banos"
                        type="number"
                        value={form.Banos}
                        onChange={onChange}
                        fullWidth
                        error={!!errors.Banos}
                        helperText={errors.Banos}
                    />
                </Grid>

                {/* Tamaño m² */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Tamaño m²"
                        name="Tamano_m2"
                        type="number"
                        value={form.Tamano_m2}
                        onChange={onChange}
                        fullWidth
                        error={!!errors.Tamano_m2}
                        helperText={errors.Tamano_m2}
                    />
                </Grid>

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

                {/* Email */}
                {/* <Grid item xs={12} sm={6}>
                    <TextField
                        label="Email"
                        name="Email"
                        type="email"
                        value={form.Email}
                        onChange={onChange}
                        fullWidth
                    />
                </Grid> */}

                {/* Celular
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Celular"
                        name="Celular"
                        value={form.Celular}
                        onChange={onChange}
                        fullWidth
                    />
                </Grid> */}

                {/* Descripción */}
                <Grid item xs={12}>
                    <RichTextInput
                        label="Descripción"
                        name="Descripcion"
                        value={form.Descripcion}
                        onChange={onChange}
                    />
                </Grid>

                {/* Descripción Expandida */}
                <Grid item xs={12}>
                    <RichTextInput
                        label="Descripción Expandida"
                        name="Descripcion_Expandir"
                        value={form.Descripcion_Expandir}
                        onChange={onChange}
                    />
                </Grid>

                {/* Proyecto Nombre */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Proyecto Nombre"
                        name="Proyecto_Nombre"
                        value={form.Proyecto_Nombre}
                        onChange={onChange}
                        fullWidth
                    />
                </Grid>

                {/* Galería */}
                <Grid item xs={12}>
                    <GaleriaEditorPropiedad
                        galeria={form.Galeria}
                        onChange={onImageChange}
                        onStarImage={onStarImage}
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

            {isSaving && <LoadingIndicator />}
            {successMessage && (
                <Box mt={2}>
                    <Typography color="success.main">{successMessage}</Typography>
                </Box>
            )}
        </Box>
    );
}

export default EditPropertyForm;
