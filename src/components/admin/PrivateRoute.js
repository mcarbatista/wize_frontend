import React from 'react';
import { Navigate } from 'react-router-dom';
// If your jwt-decode library supports the named export:
import { jwtDecode } from 'jwt-decode';
// Otherwise, if you get errors, use the default export:
// import jwt_decode from 'jwt-decode';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        // If using the named export:
        const decoded = jwtDecode(token);

        // If using the default export, rename accordingly:
        // const decoded = jwt_decode(token);

        // JWT 'exp' is in seconds; compare against current time in milliseconds
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        // If decoding fails, token is invalid
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }

    // If token is valid & not expired, render the protected component
    return children;
};

export default PrivateRoute;
