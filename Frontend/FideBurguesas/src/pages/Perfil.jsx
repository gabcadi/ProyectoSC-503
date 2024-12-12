import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import SidebarNavigation from '../components/SidebarNavigation';
import { UserContext } from '../hooks/UserContext';

export default function Perfil() {
	const { user } = useContext(UserContext);
	const [ubicacion, setUbicacion] = useState([]);

	useEffect(() => {
		axios
			.get('http://localhost:5000/getDireccionId/' + user.ID_DIRECCION)
			.then((response) => setUbicacion(response.data))
			.catch((error) => console.error('Error fetching data:', error));
	}, []);

	return (
		<div className="flex">
			<SidebarNavigation />
			<div className="flex-1 p-6">
				<section className="text-gray-600 body-font">
					<div className="container px-5 py-24 mx-auto flex flex-col">
						<div className="lg:w-4/6 mx-auto">
							<div className="flex flex-col sm:flex-row mt-10">
								<div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
									<div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
										<img
											src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
											alt="Avatar user"
											className="w-36 rounded-full mx-auto"
										/>
									</div>
									<div className="flex flex-col items-center text-center justify-center">
										<h2 className="font-medium title-font mt-4 text-gray-900 text-lg">
											{user.NOMBRE} {user.PRIMER_APELLIDO} {user.SEGUNDO_APELLIDO}
										</h2>
										<div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
										<p className="text-base">Correo: {user.CORREO}</p>
										<p className="text-base">Teléfono: {user.TELEFONO}</p>
									</div>
								</div>
								<div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
									<h2 className="font-medium title-font mt-4 text-gray-900 text-lg"> Ubicación: </h2>
									<p className="leading-relaxed text-lg mb-4">{ubicacion.join(", ")}</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
