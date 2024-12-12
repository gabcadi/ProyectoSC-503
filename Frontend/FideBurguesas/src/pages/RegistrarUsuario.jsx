import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RegistrarUsuario() {
	const [formData, setFormData] = useState({
		nombre: '',
		primerApellido: '',
		segundoApellido: '',
		correo: '',
		telefono: '',
		idPais: '',
		idProvincia: '',
		idCanton: '',
		idDistrito: '',
        calle: '',
        numeroCasa: '',
        otrasSenas: '',
		contrasena: '',
	});

	const [paises, setPaises] = useState([]);
	const [provincias, setProvincias] = useState([]);
	const [cantones, setCantones] = useState([]);
	const [distritos, setDistritos] = useState([]);

	useEffect(() => {
		const fetchData = async (url, setState) => {
			try {
				const response = await axios.get(url);
				setState(response.data);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData('http://localhost:5000/getAllPaises', setPaises);
		fetchData('http://localhost:5000/getAllProvincias', setProvincias);
		fetchData('http://localhost:5000/getAllCantones', setCantones);
		fetchData('http://localhost:5000/getAllDistritos', setDistritos);
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post('http://localhost:5000/agregarUsuario', formData)
			.then((response) => {
				console.log('Usuario agregado:', response.data);
				// Handle success (e.g., show a success message, redirect, etc.)
			})
			.catch((error) => {
				console.error('Error al agregar usuario:', error);
				// Handle error (e.g., show an error message)
			});
	};

	return (
		<div className="container mx-auto p-4 mt-5 shadow-xl">
			<h1 className="text-3xl font-bold text-center mb-8">Registrar Usuario</h1>
			<form onSubmit={handleSubmit} className="max-w-md mx-auto">
				<div className="mb-4">
					<label className="block text-gray-700">Nombre</label>
					<input
						type="text"
						name="nombre"
						value={formData.nombre}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded"
						required
					/>
				</div>
				<div className="mb-4 flex space-x-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700">Primer Apellido</label>
                        <input
                            type="text"
                            name="primerApellido"
                            value={formData.primerApellido}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
				    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700">Segundo Apellido</label>
                        <input
                            type="text"
                            name="segundoApellido"
                            value={formData.segundoApellido}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Correo</label>
					<input
						type="email"
						name="correo"
						value={formData.correo}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded"
						required
					/>
				</div>
                <div className="mb-4 flex space-x-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
				    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700">Número Casa</label>
                        <input
                            type="text"
                            name="numeroCasa"
                            value={formData.numeroCasa}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
				</div>
                <div className="mb-4 flex space-x-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700">Calle</label>
                        <input
                            type="number"
                            name="calle"
                            value={formData.calle}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
				    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700">Otras Señas</label>
                        <input
                            type="text"
                            name="otrasSenas"
                            value={formData.otrasSenas}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">País</label>
					<select name="idPais" value={formData.idPais} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
						<option value="">Seleccione un país</option>
						{paises.map((pais) => (
							<option key={pais[0]} value={pais[0]}>
								{pais[1]}
							</option>
						))}
					</select>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Provincia</label>
					<select
						name="idProvincia"
						value={formData.idProvincia}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded"
						required
					>
						<option value="">Seleccione una provincia</option>
						{provincias.map((provincia) => (
							<option key={provincia[0]} value={provincia[0]}>
								{provincia[1]}
							</option>
						))}
					</select>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Cantón</label>
					<select name="idCanton" value={formData.idCanton} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
						<option value="">Seleccione un cantón</option>
						{cantones.map((canton) => (
							<option key={canton[0]} value={canton[0]}>
								{canton[1]}
							</option>
						))}
					</select>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Distrito</label>
					<select
						name="idDistrito"
						value={formData.idDistrito}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded"
						required
					>
						<option value="">Seleccione un distrito</option>
						{distritos.map((distrito) => (
							<option key={distrito[0]} value={distrito[0]}>
								{distrito[1]}
							</option>
						))}
					</select>
				</div>
                <div className="mb-4">
					<label className="block text-gray-700">Contraseña</label>
					<input
						type="text"
						name="contrasena"
						value={formData.contrasena}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded"
						required
					/>
				</div>
                <div className="flex justify-center items-center">
				<button type="submit" className="w-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
					Registrar
				</button>
                </div>
			</form>
		</div>
	);
}
