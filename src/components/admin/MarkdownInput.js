// src/components/admin/MarkdownInput.js

import React from "react";
import { TextField, Grid, Typography, Paper } from "@mui/material";
import ReactMarkdown from "react-markdown";

const MarkdownInput = ({ label, name, value, onChange, error, helperText }) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextField
                    label={label}
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={helperText}
                    fullWidth
                    multiline
                    minRows={6}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                    Vista previa
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, minHeight: 160 }}>
                    <ReactMarkdown>{value || "_Escribí en Markdown para ver la vista previa..._"}</ReactMarkdown>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default MarkdownInput;
