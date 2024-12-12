import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Perfil from './pages/Perfil.jsx'
import Inventario from './pages/Inventario.jsx'
import Locales from './pages/Locales.jsx'
import RegistrarUsuario from './pages/RegistrarUsuario.jsx'
import NotFound from './pages/NotFound.jsx'
import { UserProvider } from './hooks/UserContext';

function App() {

  return (
    <div className="app-container">
      <UserProvider>
        <Router>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Menu" element={<Menu />} />
            <Route path="/Inventario" element={<Inventario />} />
            <Route path="/Perfil" element={<Perfil />} />
            <Route path="/Locales" element={<Locales />} />
            <Route path="/RegistrarUsuario" element={<RegistrarUsuario />} />
          </Routes>
        </Router>
        </UserProvider>
    </div>
  )
}

export default App
