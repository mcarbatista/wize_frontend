import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box, Typography } from "@mui/material";
import { useFormContext, useController } from "react-hook-form";

const modules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"]
    ]
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet"
];

const transformBulletPoints = (html) => {
    const container = document.createElement("div");
    container.innerHTML = html;

    const existingUls = container.querySelectorAll("ul");
    existingUls.forEach((ul) => {
        const parent = ul.parentNode;
        const liNodes = Array.from(ul.querySelectorAll("li"));
        liNodes.forEach((li) => {
            const p = document.createElement("p");
            p.innerHTML = li.innerHTML;
            parent.insertBefore(p, ul);
        });
        ul.remove();
    });

    const newNodes = [];
    let i = 0;
    while (i < container.childNodes.length) {
        const node = container.childNodes[i];
        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.tagName === "P" &&
            node.textContent.trim().startsWith("- ")
        ) {
            const ul = document.createElement("ul");
            while (
                i < container.childNodes.length &&
                container.childNodes[i].nodeType === Node.ELEMENT_NODE &&
                container.childNodes[i].tagName === "P" &&
                container.childNodes[i].textContent.trim().startsWith("- ")
            ) {
                const currentNode = container.childNodes[i];
                const li = document.createElement("li");
                li.innerHTML = currentNode.innerHTML.replace(/^- /, "");
                ul.appendChild(li);
                i++;
            }
            newNodes.push(ul);
        } else {
            newNodes.push(node);
            i++;
        }
    }

    container.innerHTML = "";
    newNodes.forEach((node) => container.appendChild(node));
    return container.innerHTML;
};

const RichTextInput = ({ label, name, value, onChange }) => {
    const formContext = useFormContext();
    const isUsingReactHookForm = name && formContext;

    let fieldValue = value;
    let fieldOnChange = onChange;

    if (isUsingReactHookForm) {
        const {
            field: { value: rhfValue, onChange: rhfOnChange }
        } = useController({
            name,
            control: formContext.control,
            defaultValue: ""
        });
        fieldValue = rhfValue;
        fieldOnChange = rhfOnChange;
    }

    const handleChange = (content, delta, source, editor) => {
        const html = transformBulletPoints(editor.getHTML());
        fieldOnChange?.(html);
    };

    return (
        <Box sx={{ mb: 3 }}>
            {label && (
                <Typography variant="subtitle1" gutterBottom>
                    {label}
                </Typography>
            )}
            <ReactQuill
                theme="snow"
                value={fieldValue}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                style={{ backgroundColor: "#fff" }}
            />
        </Box>
    );
};

export default RichTextInput;
