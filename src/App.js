import React from "react";
import { Routes, Route } from "react-router-dom"; // ✅ Only Routes & Route
import Header from "./components/Header";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Desarrollos from "./pages/Desarrollos";
import Propiedades from "./pages/Propiedades";
import PropertyDetails from "./pages/PropertyDetails";
import Servicios from "./pages/Servicios";
import Nosotros from "./pages/Nosotros";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    {/* <Route path="/desarrollo:id" element={<DetalleDesarrollos />} /> */}
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/propiedades" element={<Propiedades />} />
                    <Route path="/propiedades/:id" element={<PropertyDetails />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/desarrollos" element={<Desarrollos />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
