import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarNavigation from '../components/SidebarNavigation';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Menu() {
    const [productos, setProductos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [editProducto, setEditProducto] = useState(null);

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getProducto');
            setProductos(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const handleAddProducto = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/addProducto', {
                nombre,
                descripcion,
                precio: parseFloat(precio),
            });
            fetchProductos();
            setNombre('');
            setDescripcion('');
            setPrecio('');
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleEditProducto = (producto) => {
        setEditProducto(producto);
        setNombre(producto[0]);
        setDescripcion(producto[1]);
        setPrecio(producto[2]);
    };

    const handleUpdateProducto = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/updateProducto/${editProducto[3]}`, {
                nombre,
                descripcion,
                precio: parseFloat(precio),
            });
            fetchProductos();
            setEditProducto(null);
            setNombre('');
            setDescripcion('');
            setPrecio('');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProducto = async (id) => {
        try {
            await axios.put(`http://localhost:5000/deleteProducto/${id}`);
            fetchProductos();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="flex">
            <SidebarNavigation />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-center mb-8">Menú para compartir!</h1>
                <form onSubmit={editProducto ? handleUpdateProducto : handleAddProducto} className="mb-8">
                    <div className="mb-4">
                        <label className="block text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Descripción</label>
                        <input
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Precio</label>
                        <input
                            type="number"
                            step="0.01"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                        {editProducto ? 'Actualizar Producto' : 'Agregar Producto'}
                    </button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productos.map((producto, index) => (
                        <div key={index} className="bg-white border border-gray-300 rounded-lg p-4">
                            <h2 className="text-xl font-bold mb-2">{producto[0]}</h2>
                            <p className="text-gray-700 mb-4">{producto[1]}</p>
                            <p className="text-teal-600 font-bold">
                                {producto[2] !== undefined ? `₡${producto[2].toFixed(2)}` : 'Precio no disponible'}
                            </p>
                            <button
                                onClick={() => handleEditProducto(producto)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => handleDeleteProducto(producto[0])}
                                className="text-red-600 hover:text-red-800"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}