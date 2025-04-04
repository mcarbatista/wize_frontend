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
        acceptedFiles.forEach(file => {
            console.log(`File: ${file.name} - Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
        });
        onChange([...imagenes, ...previews]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    // 🗑 Eliminar archivo
    const handleDelete = (index) => {
        const updated = imagenes.filter((_, i) => i !== index);
        onChange(updated);
    };

    // ⭐ Marcar archivo como principal y enviar su preview a onMainSelect.
    const handleSetMain = (index) => {
        const updated = imagenes.map((img, i) => ({
            ...img,
            isMain: i === index
        }));
        onChange(updated);
        onMainSelect(updated[index].preview);
    };

    // 🔃 Reordenar
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reordered = [...imagenes];
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);
        onChange(reordered);
    };

    // Constants for size limits
    const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB for images
    const VIDEO_MAX_SIZE = 100 * 1024 * 1024;  // 100MB for videos

    // For images: count those over 10MB.
    const imageOverSizeFiles = imagenes.filter(
        (img) =>
            img.file.type.startsWith("image/") &&
            img.file.size > IMAGE_MAX_SIZE
    ).map(img => img.file.name);

    // For images: count those that are not strictly JPG.
    // A file is considered JPG only if its filename ends with '.jpg' (case insensitive)
    // and its MIME type is 'image/jpeg'
    const nonJpgCount = imagenes.filter(
        (img) =>
            img.file.type.startsWith("image/") &&
            !(img.file.name.toLowerCase().endsWith(".jpg") && img.file.type === "image/jpeg")
    ).length;

    // For videos: check for videos over 100MB and prepare file name with size in MB.
    const videoOverSizeFiles = imagenes.filter(
        (img) =>
            img.file.type.startsWith("video/") &&
            img.file.size > VIDEO_MAX_SIZE
    ).map(img => `${img.file.name} (${(img.file.size / (1024 * 1024)).toFixed(2)} MB)`);

    return (
        <Box>
            <DropArea {...getRootProps()}>
                <input {...getInputProps()} />
                <Typography>
                    Arrastrá imágenes aquí o hacé clic para subir
                </Typography>
            </DropArea>

            {/* Warning for images not in JPG format */}
            {nonJpgCount > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Warning: {nonJpgCount} image{nonJpgCount > 1 ? "s" : ""} not in JPG format.
                </Alert>
            )}

            {/* Error for images over 10MB */}
            {imageOverSizeFiles.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error: The following image file{imageOverSizeFiles.length > 1 ? "s are" : " is"} over 10MB: {imageOverSizeFiles.join(", ")}
                </Alert>
            )}

            {/* Error for videos over 100MB */}
            {videoOverSizeFiles.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error: The following video file{videoOverSizeFiles.length > 1 ? "s exceed" : " exceeds"} 100MB: {videoOverSizeFiles.join(", ")}
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
                                        <Grid
                                            item
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
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
