import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import EditPropertyForm from "../../components/admin/EditPropertyForm";
import LoadingIndicator from "../../components/admin/LoadingIndicator";
import BASE_URL from "../../api/config";
import axios from "axios";

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [form, setForm] = useState(null);
    const [desarrollos, setDesarrollos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            navigate("/login");
            return;
        }
        setToken(storedToken);
        fetchInitialData(storedToken);
    }, [id, navigate]);

    const fetchInitialData = async (token) => {
        try {
            const [desRes, usrRes, propRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/desarrollos`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${BASE_URL}/api/auth/usuarios`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${BASE_URL}/api/propiedades/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const prop = propRes.data;

            console.log("✅ prop desde backend:", prop);

            setForm((prev) => {
                if (prev) return prev; // ya hay data, no sobrescribir
                return {
                    Titulo: prop.Titulo || "",
                    Owner: "", // user will select manually
                    Descripcion: prop.Descripcion || "",
                    Descripcion_Expandir: prop.Descripcion_Expandir || "",
                    Precio: prop.Precio || "",
                    Estado: prop.Estado || "",
                    Resumen: prop.Resumen || "",
                    Ciudad: prop.Ciudad || "",
                    Barrio: prop.Barrio || "",
                    Ubicacion: prop.Ubicacion || "",
                    Tipo: prop.Tipo || "",
                    Entrega: prop.Entrega || "",
                    Dormitorios: prop.Dormitorios || "",
                    Banos: prop.Banos || "",
                    Tamano_m2: prop.Tamano_m2 || "",
                    Metraje: prop.Metraje || "",
                    Piso: prop.Piso || "",
                    Unidad: prop.Unidad || "",
                    Forma_de_Pago: prop.Forma_de_Pago || "",
                    Gastos_Ocupacion: prop.Gastos_Ocupacion || "",
                    Proyecto_Nombre: prop.Proyecto_Nombre || "",
                    Imagen: prop.Imagen || "",
                    Galeria: Array.isArray(prop.Galeria) ? prop.Galeria : [], // ✅ aseguramos array válido
                    Plano: Array.isArray(prop.Plano) ? prop.Plano : [],
                    Email: "",
                    Celular: "",
                    syncInfoCasas: prop.syncInfoCasas || false,
                };
            });

            setDesarrollos(desRes.data);
            setUsuarios(usrRes.data);
        } catch (err) {
            console.error("Error al cargar datos de edición:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "Owner") {
            const selected = usuarios.find((u) => u._id === value);
            setForm((prev) => ({
                ...prev,
                Owner: value,
                Email: selected?.email || "",
                Celular: selected?.celular || "",
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleImageChange = (imagenes) => {
        setForm((prev) => ({ ...prev, Galeria: imagenes }));
    };

    const requiredFields = ["Titulo", "Precio", "Dormitorios", "Banos", "Tamano_m2", "Owner"];

    const handleSubmit = async () => {
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (!form[field]) {
                newErrors[field] = "* Campo requerido";
            }
        });

        const galeriaTienePrincipal = form.Galeria?.some((img) => img.isMain) || form.Imagen;
        if (!galeriaTienePrincipal) {
            newErrors.Galeria = "Debés seleccionar una imagen o video principal (haz clic en la estrella)";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            alert("Por favor completá todos los campos requeridos.");
            return;
        }

        const precio = Number(form.Precio);
        const tamano = Number(form.Tamano_m2);
        if (isNaN(precio) || isNaN(tamano)) {
            alert("Precio y Tamaño en m2 deben ser números.");
            return;
        }

        setIsSaving(true);
        try {
            const formDataImgs = new FormData();
            const folderGaleria = `wize/propiedades/fotos/${form.Proyecto_Nombre}`;
            formDataImgs.append("folder", folderGaleria);
            form.Galeria.forEach((img) => {
                if (img.file) formDataImgs.append("imagenes", img.file);
            });

            const galeriaRes = await axios.post(`${BASE_URL}/api/upload`, formDataImgs, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });

            const imagenesFinal = [
                ...form.Galeria.filter((img) => !img.file),
                ...(galeriaRes.data.galeria || [])
            ].map((img, index) => ({
                ...img,
                position: index
            }));

            const mainImage = form.Imagen || imagenesFinal.find((img) => img.isMain)?.url;

            const payload = {
                ...form,
                Precio: precio,
                Tamano_m2: tamano,
                Imagen: mainImage,
                Galeria: imagenesFinal
            };

            console.log("✅ Editando propiedad:", payload);

            await axios.put(`${BASE_URL}/api/propiedades/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMessage("Propiedad actualizada con éxito.");
            setTimeout(() => {
                setSuccessMessage("");
                navigate("/admin/propiedades");
            }, 5000);
        } catch (err) {
            console.error("❌ Error al editar propiedad:", err);
            alert("Hubo un error. Revisá la consola.");
        } finally {
            setIsSaving(false);
        }
    };


    if (!form) return <LoadingIndicator />;

    return (
        <Box p={4}>
            <Typography variant="h4" mb={4} className="admin-title">
                Editar Propiedad
            </Typography>
            <Button
                className="admin-button"
                variant="outlined"
                sx={{ mb: 3 }}
                onClick={() => navigate("/admin/propiedades")}
            >
                ← Volver a Propiedades
            </Button>
            <EditPropertyForm
                form={form}
                desarrollos={[]}
                usuarios={usuarios}
                editId={id}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onImageChange={handleImageChange}
                errors={errors}
                successMessage={successMessage}
                isSaving={isSaving}
            />
            {isSaving && <LoadingIndicator />}
        </Box>
    );
};

export default EditProperty;
