import React, { useState, useRef, useEffect } from "react";
import { Box, Button } from "@mui/material";
import DOMPurify from "dompurify";

const DescriptionWithExpand = ({ shortText = "", extraText = "", className = "" }) => {
    const [expanded, setExpanded] = useState(false);
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);

    const hasExtraContent = extraText && extraText.trim().length > 0;
    const combinedHTML = shortText + (expanded && hasExtraContent ? extraText : "");
    const safeHTML = DOMPurify.sanitize(combinedHTML);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [expanded, shortText, extraText]);

    return (
        <Box>
            <Box
                sx={{
                    maxHeight: expanded ? `${contentHeight}px` : "300px",
                    overflow: "hidden",
                    transition: "max-height 0.5s ease, opacity 0.5s ease",
                    opacity: expanded ? 1 : 0.9,
                }}
                ref={contentRef}
                className={className}
                dangerouslySetInnerHTML={{ __html: safeHTML }}
            />

            {hasExtraContent && (
                <Button
                    onClick={() => setExpanded(!expanded)}
                    sx={{
                        textTransform: "none",
                        color: "#0F4C54",
                        fontWeight: "bold",
                        marginTop: "8px",
                        fontFamily: "Avenir Heavy, sans-serif",
                        alignSelf: "flex-start"
                    }}
                >
                    {expanded ? "Mostrar menos -" : "Más +"}
                </Button>
            )}
        </Box>
    );
};

export default DescriptionWithExpand;
