import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarNavigation from '../components/SidebarNavigation';

export default function Proveedores() {
	const [provedores, setProvedores] = useState([]);

	useEffect(() => {
		axios
			.get('http://localhost:5000/getProvedores')
			.then((response) => setProvedores(response.data))
			.catch((error) => console.error('Error fetching data:', error));
	}, []);

	return (
		<div className="flex">
			<SidebarNavigation />
			<div className="container mx-auto p-4">
				<h1 className="text-3xl font-bold text-center mb-8">Nuestros provedores autorizados</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{provedores.map((provedor, index) => (
						<div key={index} className="bg-white border border-gray-300 rounded-lg p-4">
							<h2 className="text-xl font-bold mb-2">{provedor[0]}</h2>
							<p className="text-gray-700 mb-4">{producto[1]}</p>
							<p className="text-teal-600 font-bold">₡{producto[2].toFixed(2)}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
