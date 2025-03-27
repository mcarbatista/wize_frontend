import React from "react";
import { Routes, Route } from "react-router-dom"; // ✅ Only Routes & Route
import Header from "./components/Header";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Desarrollos from "./pages/Desarrollos";
import Propiedades from "./pages/Propiedades";
import PropertyDetails from "./pages/PropertyDetails";
import DevelopmentDetails from "./pages/DevelopmentDetails"; // 🛠️ Asegurate de que la ruta sea correcta
import Servicios from "./pages/Servicios";
import Nosotros from "./pages/Nosotros";
import NotFound from "./pages/NotFound";
import AdminPropiedades from "./pages/AdminPropiedades";
import AdminDesarrollos from "./pages/AdminDesarrollos";
import AdminSelector from "./pages/AdminSelector";

import HomeStaging from "./pages/HomeStaging"; // o desde donde esté ubicado



import './App.css';

function App() {
    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/propiedades" element={<Propiedades />} />
                    <Route path="/propiedades/:id" element={<PropertyDetails />} />
                    <Route path="/desarrollos/:id" element={<DevelopmentDetails />} />
                    <Route path="/servicios/homeStaging" element={<HomeStaging />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/desarrollos" element={<Desarrollos />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="/admin" element={<AdminSelector />} />
                    <Route path="/admin/desarrollos" element={<AdminDesarrollos />} />
                    <Route path="/admin/propiedades" element={<AdminPropiedades />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
