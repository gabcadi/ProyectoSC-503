import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarNavigation from '../components/SidebarNavigation';

export default function Locales() {
    const [productos, setProductos] = useState([]);
    const [ubicaciones, setUbicaciones] = useState({});

    useEffect(() => {
        axios
            .get('http://localhost:5000/getLocales')
            .then((response) => {
                setProductos(response.data);
                response.data.forEach((producto) => {
                    fetchUbicacion(producto[2]);
                });
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const fetchUbicacion = (idDireccion) => {
        axios
            .get(`http://localhost:5000/getDireccionId/${idDireccion}`)
            .then((response) => {
                setUbicaciones((prevUbicaciones) => ({
                    ...prevUbicaciones,
                    [idDireccion]: response.data.join(", "),
                }));
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    return (
        <div className="flex">
            <SidebarNavigation />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-center mb-8">Menú para compartir!</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productos.map((producto, index) => (
                        <div key={index} className="bg-white border border-gray-300 rounded-lg p-4">
                            <h2 className="text-xl font-bold mb-2">{producto[0]}</h2>
                            <p className="text-gray-700 mb-4">Teléfono: {producto[1]}</p>
                            <p className="text-teal-600 font-bold">Ubicación: {ubicaciones[producto[2]] || 'Cargando...'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}