// src/components/admin/GaleriaEditor.js

import React from "react";
import { useDropzone } from "react-dropzone";
import {
    Box,
    Typography,
    IconButton,
    Grid,
    Paper,
    Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { styled } from "@mui/system";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// 🧩 Estilos
const DropArea = styled(Box)(({ theme }) => ({
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: theme.spacing(2),
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
    marginBottom: theme.spacing(2),
}));

const ImageCard = styled(Paper)(({ theme }) => ({
    position: "relative",
    padding: theme.spacing(1),
    textAlign: "center",
}));

// 🧠 Componente principal
const GaleriaEditor = ({ imagenes, onChange, imagenPrincipal, onMainSelect }) => {
    // 🧩 Drop handler
    const onDrop = async (acceptedFiles) => {
        const previews = await Promise.all(
            acceptedFiles.map((file) =>
                new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve({
                            file,
                            preview: reader.result,
                            alt: "",
                            description: "",
                            isMain: false
                        });
                    };
                    reader.readAsDataURL(file);
                })
            )
        );
        onChange([...imagenes, ...previews]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    // 🗑 Eliminar archivo
    const handleDelete = (index) => {
        const updated = imagenes.filter((_, i) => i !== index);
        onChange(updated);
    };

    // ⭐ Elegir archivo principal y enviarlo como 'Imagen' en el payload
    const handleSetMain = (index) => {
        const updated = imagenes.map((img, i) => ({
            ...img,
            isMain: i === index
        }));
        onChange(updated);
        onMainSelect({ imagen: updated[index] });
    };

    // 🔃 Reordenar
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reordered = [...imagenes];
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);
        onChange(reordered);
    };

    // Contar archivos que NO tienen extensión .jpg (case insensitive)
    const nonJpgCount = imagenes.filter(
        (img) => !img.file.name.toLowerCase().endsWith(".jpg")
    ).length;

    // Filtrar archivos que superan los 10MB (10 * 1024 * 1024 bytes)
    const MAX_SIZE = 10 * 1024 * 1024;
    const overSizeFiles = imagenes.filter(
        (img) => img.file.size > MAX_SIZE
    ).map(img => img.file.name);

    return (
        <Box>
            <DropArea {...getRootProps()}>
                <input {...getInputProps()} />
                <Typography>
                    Arrastrá imágenes aquí o hacé clic para subir
                </Typography>
            </DropArea>

            {nonJpgCount > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Warning: {nonJpgCount} file{nonJpgCount > 1 ? "s" : ""} not in .jpg format.
                </Alert>
            )}

            {overSizeFiles.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Warning: The following file{overSizeFiles.length > 1 ? "s are" : " is"} over 10MB: {overSizeFiles.join(", ")}
                </Alert>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="imagenes" direction="horizontal">
                    {(provided) => (
                        <Grid
                            container
                            spacing={2}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            wrap="nowrap"
                            sx={{ overflowX: "auto", pb: 2 }}
                        >
                            {imagenes.map((img, index) => (
                                <Draggable key={index} draggableId={`img-${index}`} index={index}>
                                    {(provided) => (
                                        <Grid item ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <ImageCard elevation={2}>
                                                {img.file.type.startsWith("video/") ? (
                                                    <video
                                                        src={img.preview}
                                                        controls
                                                        style={{
                                                            width: 120,
                                                            height: 120,
                                                            objectFit: "cover",
                                                            borderRadius: "8px",
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={img.preview}
                                                        alt={img.alt || `Imagen ${index + 1}`}
                                                        style={{
                                                            width: 120,
                                                            height: 120,
                                                            objectFit: "cover",
                                                            borderRadius: "8px",
                                                        }}
                                                    />
                                                )}
                                                <Box display="flex" justifyContent="center">
                                                    <IconButton onClick={() => handleDelete(index)} size="small">
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleSetMain(index)} size="small">
                                                        {img.isMain ? (
                                                            <StarIcon color="warning" fontSize="small" />
                                                        ) : (
                                                            <StarBorderIcon fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </Box>
                                            </ImageCard>
                                        </Grid>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Grid>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
};

export default GaleriaEditor;
