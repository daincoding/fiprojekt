import './App.css'
import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar.jsx";
import { AnimatePresence, motion } from "framer-motion";

import { AuthProvider } from "./context/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import Firmen from "./pages/Firmen.jsx";
import Kunden from "./pages/Kunden.jsx";
import NeueRechnung from "./pages/NeueRechnung.jsx";
import Rechnungen from "./pages/Rechnungen.jsx";

function App() {
    return (
        <AuthProvider>
            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                <Navbar />
            </motion.div>

            <AnimatePresence mode="wait">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <motion.div key="home" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                                <Home />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                                <Dashboard />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <motion.div key="login" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                                <Login />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <motion.div key="register" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                                <Register />
                            </motion.div>
                        }
                    />

                    <Route
                        path="/firmen"
                        element={
                            <motion.div key="firmen" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                                <Firmen />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/kunden"
                        element={
                            <motion.div key="kunden" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                                <Kunden />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/rechnung-neu"
                        element={
                            <motion.div key="rechnung-neu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                                <NeueRechnung />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/rechnungen"
                        element={
                            <motion.div key="rechnungen" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                                <Rechnungen />
                            </motion.div>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </AuthProvider>
    );
}

export default App;