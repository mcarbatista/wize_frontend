import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography } from '@mui/material';

const MarkdownTypography = ({ content = "", className = "" }) => {
    return (
        <ReactMarkdown
            components={{
                h1: ({ node, ...props }) => (
                    <Typography variant="h4" gutterBottom className={className} {...props} />
                ),
                h2: ({ node, ...props }) => (
                    <Typography variant="h5" gutterBottom className={className} {...props} />
                ),
                h3: ({ node, ...props }) => (
                    <Typography variant="h6" gutterBottom className={className} {...props} />
                ),
                p: ({ node, ...props }) => (
                    <Typography variant="body1" paragraph className={className} {...props} />
                ),
                strong: ({ node, ...props }) => (
                    <strong style={{ fontWeight: 700 }} {...props} />
                ),
                em: ({ node, ...props }) => (
                    <em style={{ fontStyle: 'italic' }} {...props} />
                ),
                ul: ({ node, ...props }) => (
                    <ul className={className} style={{ paddingLeft: '1.2rem' }} {...props} />
                ),
                ol: ({ node, ...props }) => (
                    <ol className={className} style={{ paddingLeft: '1.2rem' }} {...props} />
                ),
                li: ({ node, ...props }) => (
                    <li className={className} style={{ marginBottom: '0.25rem' }} {...props} />
                ),
                a: ({ node, ...props }) => (
                    <a
                        className={className}
                        style={{ color: '#0F4C54', textDecoration: 'underline' }}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                    />
                ),
                blockquote: ({ node, ...props }) => (
                    <blockquote style={{
                        borderLeft: '4px solid #ccc',
                        margin: '1rem 0',
                        padding: '0.5rem 1rem',
                        color: '#555',
                        fontStyle: 'italic'
                    }} {...props} />
                ),
                code: ({ node, ...props }) => (
                    <code style={{
                        backgroundColor: '#f4f4f4',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        fontFamily: 'monospace'
                    }} {...props} />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownTypography;
