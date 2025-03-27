import React, { useState } from "react";
import { Typography, Button } from "@mui/material";

const DescriptionWithExpand = ({ shortText, fullText }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            {/* Show short text if not expanded, otherwise show full text */}
            <Typography variant="body1" className="property-detail-summary">
                {expanded ? fullText : shortText}
            </Typography>

            {/* Toggle button */}
            <Button
                onClick={() => setExpanded(!expanded)}
                sx={{
                    textTransform: "none",
                    color: "#0F4C54",
                    fontWeight: "bold",
                    marginTop: "8px",
                    fontFamily: "Avenir Heavy, sans serif"
                }}
            >
                {expanded ? "Mostrar menos -" : "Más +"}
            </Button>
        </div>
    );
};

export default DescriptionWithExpand;
