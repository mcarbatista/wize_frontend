import React from "react";
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
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Styled drop area and image card
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

const GaleriaEditorPropiedad = ({ imagenes = [], onChange, selectedMainImage, onMainSelect }) => {
    // onDrop handler for new files (images and videos)
    const onDrop = async (acceptedFiles) => {
        const uploads = await Promise.all(
            acceptedFiles.map((file) =>
                new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve({
                            preview: reader.result,
                            alt: file.name,
                            description: "",
                            position: imagenes.length, // temporary position; will update below
                            file,
                            isMain: false,
                        });
                    };
                    reader.readAsDataURL(file);
                })
            )
        );

        // Append new files and update positions
        const updated = [...imagenes, ...uploads];
        updated.forEach((img, i) => (img.position = i));
        onChange(updated);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: true });

    // Delete file handler
    const handleDelete = (index) => {
        const updated = imagenes.filter((_, i) => i !== index);
        updated.forEach((img, i) => (img.position = i));
        onChange(updated);
    };

    // Set file as main
    const handleSetMain = (index) => {
        const updated = imagenes.map((img, i) => ({
            ...img,
            isMain: i === index,
        }));
        onChange(updated);
        // Pass the main file source (preview if available, otherwise url)
        onMainSelect(updated[index].preview || updated[index].url);
    };

    // Handle drag-and-drop reordering
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reordered = [...imagenes];
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);
        reordered.forEach((img, i) => (img.position = i));
        onChange(reordered);
    };

    // Constants for size limits
    const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB for images
    const VIDEO_MAX_SIZE = 100 * 1024 * 1024;  // 100MB for videos

    // Error/warning messages for oversized files or non-JPG images
    const imageOverSizeFiles = imagenes
        .filter(
            (img) =>
                img.file &&
                img.file.type.startsWith("image/") &&
                img.file.size > IMAGE_MAX_SIZE
        )
        .map((img) => img.file.name);

    const videoOverSizeFiles = imagenes
        .filter(
            (img) =>
                img.file &&
                img.file.type.startsWith("video/") &&
                img.file.size > VIDEO_MAX_SIZE
        )
        .map((img) => `${img.file.name} (${(img.file.size / (1024 * 1024)).toFixed(2)} MB)`);

    const nonJpgCount = imagenes.filter(
        (img) =>
            img.file &&
            img.file.type.startsWith("image/") &&
            !(img.file.name.toLowerCase().endsWith(".jpg") && img.file.type === "image/jpeg")
    ).length;

    // Helper functions to get the source and determine if the file is a video
    const getSource = (img) => img.preview || img.url;
    const isVideo = (img) => {
        if (img.file) return img.file.type.startsWith("video/");
        return img.type === "video";
    };

    return (
        <Box>
            <DropArea {...getRootProps()}>
                <input {...getInputProps()} />
                <Typography>
                    Arrastrá imágenes o videos aquí o hacé clic para subir
                </Typography>
            </DropArea>

            {/* Warning for non-JPG images */}
            {nonJpgCount > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Warning: {nonJpgCount} image{nonJpgCount > 1 ? "s" : ""} not in JPG format.
                </Alert>
            )}

            {/* Error messages for oversized files */}
            {imageOverSizeFiles.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error: The following image file{imageOverSizeFiles.length > 1 ? "s are" : " is"} over 10MB: {imageOverSizeFiles.join(", ")}
                </Alert>
            )}

            {videoOverSizeFiles.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error: The following video file{videoOverSizeFiles.length > 1 ? "s exceed" : " exceeds"} 100MB: {videoOverSizeFiles.join(", ")}
                </Alert>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="galeria-propiedad" direction="horizontal">
                    {(provided) => (
                        <Grid
                            container
                            spacing={2}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            wrap="nowrap"
                            sx={{ overflowX: "auto", pb: 2 }}
                        >
                            {imagenes.map((img, index) => {
                                const source = getSource(img);
                                const videoCheck = isVideo(img);
                                return (
                                    <Draggable key={index} draggableId={`img-${index}`} index={index}>
                                        {(provided) => (
                                            <Grid
                                                item
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <ImageCard elevation={2}>
                                                    {videoCheck ? (
                                                        <video
                                                            src={source}
                                                            controls
                                                            style={{
                                                                width: 120,
                                                                height: 120,
                                                                objectFit: "cover",
                                                                borderRadius: "8px"
                                                            }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={source}
                                                            alt={img.alt || `Imagen ${index + 1}`}
                                                            style={{
                                                                width: 120,
                                                                height: 120,
                                                                objectFit: "cover",
                                                                borderRadius: "8px"
                                                            }}
                                                        />
                                                    )}
                                                    <Box display="flex" justifyContent="center">
                                                        <IconButton onClick={() => handleDelete(index)} size="small">
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleSetMain(index)} size="small">
                                                            {img.isMain || selectedMainImage === source ? (
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
                                );
                            })}
                            {provided.placeholder}
                        </Grid>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
};

export default GaleriaEditorPropiedad;
