import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingIndicator = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={2}
        >
            <CircularProgress />
            <Typography variant="body2" mt={1}>
                Guardando...
            </Typography>
        </Box>
    );
};

export default LoadingIndicator;
