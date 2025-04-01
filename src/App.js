import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // <-- add useLocation
import Header from "./components/Header";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Desarrollos from "./pages/Desarrollos";
import Propiedades from "./pages/Propiedades";
import PropertyDetails from "./pages/PropertyDetails";
import DevelopmentDetails from "./pages/DevelopmentDetails";
import Servicios from "./pages/Servicios";
import Nosotros from "./pages/Nosotros";
import NotFound from "./pages/NotFound";
import AdminPropiedades from "./pages/Admin/AdminPropiedades";
import AdminDesarrollos from "./pages/Admin/AdminDesarrollos";
import EditDevelopment from "./pages/Admin/EditDevelopment";
import EditProperty from "./pages/Admin/EditProperty";
import AdminSelector from "./pages/Admin/AdminSelector";
import HomeStaging from "./pages/HomeStaging";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PrivateRoute from './components/admin/PrivateRoute';
import LoginPage from "./components/admin/LoginPage";
import CreateUserPage from "./components/admin/CreateUserPage";
import ChangePassword from "./components/admin/ChangePassword";
import './App.css';

function App() {
    // 1) Grab the current URL location
    const location = useLocation();

    // 2) List any paths where you want to hide the header
    const hideHeaderPaths = ["/admin/desarrollos", "/admin/propiedades", "admin/create-user", "admin/change-password", "/admin/desarrollos/edit/{:id}"];

    // 3) Check if we are on a path where the header should be hidden
    const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

    return (
        <div className="app-container">
            {/* 4) Only show <Header> if we're NOT on the specified admin routes */}
            {!shouldHideHeader && <Header />}

            <main className="main-content">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/admin/create-user"
                        element={
                            <PrivateRoute>
                                <CreateUserPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/change-password"
                        element={
                            <PrivateRoute>
                                <ChangePassword />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/admin" element={<AdminSelector />} />
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
                    <Route path="/admin/desarrollos" element={<AdminDesarrollos />} />
                    <Route path="/admin/desarrollos/edit/:id" element={<EditDevelopment />} />
                    <Route path="/admin/propiedades/edit/:id" element={<EditProperty />} />
                    <Route path="/admin/propiedades" element={<AdminPropiedades />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;
