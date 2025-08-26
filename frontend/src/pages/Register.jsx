import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const { register } = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState("");

    function onSubmit(e) {
        e.preventDefault();
        register({ email });
        nav("/dashboard");
    }

    return (
        <div className="container-page max-w-md">
            <h1 className="text-3xl font-bold mb-4">Registrieren</h1>
            <form onSubmit={onSubmit} className="space-y-3">
                <input className="input" placeholder="E-Mail" value={email} onChange={e=>setEmail(e.target.value)} />
                <button className="btn btn-primary w-full">Account erstellen</button>
            </form>
        </div>
    );
}