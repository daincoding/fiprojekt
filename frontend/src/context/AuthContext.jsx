import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("auth_user");
        if (saved) setUser(JSON.parse(saved));
    }, []);

    function login({ email }) {
        const fakeUser = { id: "u1", email };
        setUser(fakeUser);
        localStorage.setItem("auth_user", JSON.stringify(fakeUser));
    }

    function register({ email }) {
        // gleiches Verhalten wie login – später echte API
        login({ email });
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

export function useAuth() {
    return useContext(AuthContext);
}