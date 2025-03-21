import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Correct import
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary"; // ✅ Optional for handling errors

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter> {/* ✅ Ensures Router Context is available */}
                <App />
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>
);
