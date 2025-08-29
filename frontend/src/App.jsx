import './App.css'
import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ApiTest from "./pages/ApiTest.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import Firmen from "./pages/Firmen.jsx";
import Kunden from "./pages/Kunden.jsx";
import NeueRechnung from "./pages/NeueRechnung.jsx";
import Rechnungen from "./pages/Rechnungen.jsx";

function App() {
    return (
        <AuthProvider>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/firmen" element={<Firmen />} />
                <Route path="/kunden" element={<Kunden />} />
                <Route path="/rechnung-neu" element={<NeueRechnung />} />
                <Route path="/rechnungen" element={<Rechnungen />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;