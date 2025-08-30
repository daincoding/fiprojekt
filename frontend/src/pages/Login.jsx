import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");
        try {
            await login({ email, password });
            nav("/dashboard");
        } catch (e) {
            setErr("Login fehlgeschlagen");
        }
    }

    return (
        <motion.div
            className="container-page max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.h1
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
            >
                Login
            </motion.h1>

            {err && (
                <motion.div
                    className="badge-danger rounded-full mb-3 inline-block px-3 py-1"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                    {err}
                </motion.div>
            )}

            <motion.form
                onSubmit={onSubmit}
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <motion.input
                    className="input"
                    type="email"
                    placeholder="E-Mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    whileFocus={{ scale: 1.02, borderColor: "#00A3A3" }}
                />
                <motion.input
                    className="input"
                    type="password"
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    whileFocus={{ scale: 1.02, borderColor: "#00A3A3" }}
                />
                <motion.button
                    className="btn btn-primary w-full"
                    type="submit"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Einloggen
                </motion.button>
            </motion.form>
        </motion.div>
    );
}