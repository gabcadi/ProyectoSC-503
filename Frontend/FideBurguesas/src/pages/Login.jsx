import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { UserContext } from '../hooks/UserContext';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate(); 
	const { setUser } = useContext(UserContext);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
		  const response = await axios.post('http://localhost:5000/login', { email, password });
		  if (response.status === 200) {
			setUser(response.data[0]);
			navigate('/Home');
		  } else {
			  setMessage(response.data);
		  }
		} catch (error) {
		  setMessage(error.response.data);
		}
	  };
	

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						alt="Your Company"
						src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
						className="mx-auto h-10 w-auto"
					/>
					<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
						Bienvenidos a FideBurguesas
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form onSubmit={handleLogin} className="space-y-6">
						<div>
							<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
								Correo electrónico:
							</label>
							<div className="mt-2">
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
									Contraseña:
								</label>
								<div className="text-sm">
									<a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
										¿Olvidaste tu contraseña?
									</a>
								</div>
							</div>
							<div className="mt-2">
								<input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Ingresar
							</button>
						</div>
					</form>
					<p className="mt-10 text-center text-sm/6 text-gray-500">
						¿No tienes usuario?{' '}
						<a href="/RegistrarUsuario" className="font-semibold text-indigo-600 hover:text-indigo-500">
							Contactá a soporte para obtener un usuario
						</a>
					</p>
				</div>
				{message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
			</div>
		</>
	);
}
