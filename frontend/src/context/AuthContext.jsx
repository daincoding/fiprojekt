// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../hooks/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("auth_user");
        if (saved) setUser(JSON.parse(saved));
    }, []);

    async function login({ email, password }) {
        const u = await api.login({ email, password }); // -> {id,email,role}
        setUser(u);
        localStorage.setItem("auth_user", JSON.stringify(u));
    }

    async function register({ email, password }) {
        const u = await api.registerUser({ email, password }); // -> {id,email,role}
        setUser(u);
        localStorage.setItem("auth_user", JSON.stringify(u));
    }

    function logout() {
        setUser(null);
        localStorage.removeItem("auth_user");
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() { return useContext(AuthContext); }