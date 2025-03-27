import React from "react";
import {
    Box,
    Typography,
    IconButton,
    Grid,
    Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { styled } from "@mui/system";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

const GaleriaEditorPropiedad = ({ imagenes = [], onChange, ImagenPrincipal, onMainSelect }) => {
    const onDrop = async (acceptedFiles) => {
        const uploads = await Promise.all(
            acceptedFiles.map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve({
                            url: reader.result,
                            alt: file.name,
                            description: "",
                            position: imagenes.length,
                            file,
                        });
                    };
                    reader.readAsDataURL(file);
                });
            })
        );

        const updated = [...imagenes, ...uploads];
        updated.forEach((img, i) => (img.position = i));
        onChange(updated);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleDelete = (index) => {
        const updated = imagenes.filter((_, i) => i !== index);
        updated.forEach((img, i) => (img.position = i));
        onChange(updated);
    };

    const handleSetMain = (url) => {
        onMainSelect(url);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reordered = [...imagenes];
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);
        reordered.forEach((img, i) => (img.position = i));
        onChange(reordered);
    };

    return (
        <Box>
            <DropArea {...getRootProps()}>
                <input {...getInputProps()} />
                <Typography>Arrastrá imágenes aquí o hacé clic para subir</Typography>
            </DropArea>

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
                            {(imagenes || []).map((img, index) => (
                                <Draggable key={index} draggableId={`img-${index}`} index={index}>
                                    {(provided) => (
                                        <Grid
                                            item
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <ImageCard elevation={2}>
                                                <img
                                                    src={img.url}
                                                    alt={img.alt || `Imagen ${index + 1}`}
                                                    style={{
                                                        width: 120,
                                                        height: 120,
                                                        objectFit: "cover",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                                <Box display="flex" justifyContent="center">
                                                    <IconButton onClick={() => handleDelete(index)} size="small">
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleSetMain(img.url)} size="small">
                                                        {ImagenPrincipal === img.url ? (
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

export default GaleriaEditorPropiedad;
