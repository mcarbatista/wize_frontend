// src/components/admin/RichTextInput.js
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box, Typography } from "@mui/material";

const RichTextInput = ({ label, value, onChange }) => {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
                {label}
            </Typography>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                style={{ backgroundColor: "#fff" }}
            />
        </Box>
    );
};

export default RichTextInput;
