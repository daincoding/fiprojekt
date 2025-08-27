import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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
        <div className="container-page max-w-md">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            {err && <div className="badge-danger rounded-full mb-3 inline-block px-3 py-1">{err}</div>}
            <form onSubmit={onSubmit} className="space-y-3">
                <input className="input" type="email" placeholder="E-Mail" value={email} onChange={e=>setEmail(e.target.value)} required />
                <input className="input" type="password" placeholder="Passwort" value={password} onChange={e=>setPassword(e.target.value)} required />
                <button className="btn btn-primary w-full">Einloggen</button>
            </form>
        </div>
    );
}