import React, { useCallback, useState } from "react"; import { useDropzone } from "react-dropzone"; import { Box, Typography, LinearProgress, IconButton } from "@mui/material"; import CloudUploadIcon from "@mui/icons-material/CloudUpload"; import DeleteIcon from "@mui/icons-material/Delete"; import axios from "axios";

const ImageUploader = ({ value = [], onChange }) => {
    const [uploading, setUploading] = useState(false); const [progress, setProgress] = useState(0);

    // javascript
    // Copy
    // Edit
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "propiedades_fotos");

        const response = await axios.post("https://api.cloudinary.com/v1_1/drxyqkzud/image/upload", formData, {
            onUploadProgress: (e) => {
                setProgress(Math.round((e.loaded * 100) / e.total));
            }
        });

        return {
            url: response.data.secure_url,
            public_id: response.data.public_id,
        };
    };

    const deleteFromCloudinary = async (public_id) => {
        try {
            await axios.post("/api/upload/delete", { public_id });
        } catch (error) {
            console.error("❌ Error deleting from Cloudinary:", error);
        }
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        setUploading(true);
        const uploaded = [];

        for (const file of acceptedFiles) {
            try {
                const img = await uploadToCloudinary(file);
                uploaded.push(img);
            } catch (error) {
                console.error("Upload failed:", error);
            }
        }

        const updated = [...value, ...uploaded];
        onChange(updated);
        setUploading(false);
        setProgress(0);
    }, [value, onChange]);

    const handleRemove = async (img) => {
        await deleteFromCloudinary(img.public_id);
        const updated = value.filter((i) => i.public_id !== img.public_id);
        onChange(updated);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <Box {...getRootProps()} sx={{
            border: "2px dashed #aaa",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
            backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
            cursor: "pointer",
            mb: 2
        }}>
            <input {...getInputProps()} />
            <CloudUploadIcon fontSize="large" />
            <Typography>
                {isDragActive ? "Drop files here..." : "Drag & drop or click to upload"}
            </Typography>

            {uploading && (
                <Box mt={2}>
                    <Typography variant="body2">Uploading...</Typography>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            )}

            {value.length > 0 && (
                <Box display="flex" flexWrap="wrap" gap={2} mt={2} justifyContent="center">
                    {value.map((img, idx) => (
                        <Box key={idx} position="relative">
                            <img
                                src={img.url}
                                alt={`preview-${idx}`}
                                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 4 }}
                            />
                            <IconButton
                                size="small"
                                sx={{ position: "absolute", top: 0, right: 0, backgroundColor: "white" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(img);
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ImageUploader;