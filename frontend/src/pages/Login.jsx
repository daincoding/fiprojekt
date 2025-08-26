import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState("");

    function onSubmit(e) {
        e.preventDefault();
        login({ email });
        nav("/dashboard"); // zurück auf Home/Dashboard
    }

    return (
        <div className="container-page max-w-md">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <form onSubmit={onSubmit} className="space-y-3">
                <input className="input" placeholder="E-Mail" value={email} onChange={e=>setEmail(e.target.value)} />
                <button className="btn btn-primary w-full">Einloggen</button>
            </form>
        </div>
    );
}