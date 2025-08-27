import { useEffect, useState } from "react";

export default function Kunden() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: "", email: "", ort: "" });

    // Kunden laden (GET)
    useEffect(() => {
        fetch("http://localhost:8080/api/customers")
            .then((res) => res.json())
            .then((data) => setCustomers(data))
            .finally(() => setLoading(false));
    }, []);

    // Neuen Kunden anlegen (POST)
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
            .then((res) => res.json())
            .then((newCustomer) => setCustomers([...customers, newCustomer]));

        setForm({ name: "", email: "", ort: "" });
    };

    if (loading) return <p>Lade Kunden...</p>;

    return (
        <div className="container-page">
            <h1 className="text-3xl font-bold mb-4">Kunden</h1>

            {/* Kundenliste */}
            <ul className="mb-6">
                {customers.map((kunde) => (
                    <li key={kunde.id} className="border-b py-2">
                        <strong>{kunde.name}</strong> – {kunde.email} ({kunde.ort})
                    </li>
                ))}
            </ul>

            {/* Formular neuer Kunde */}
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border p-2 w-full"
                />
                <input
                    type="email"
                    placeholder="E-Mail"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border p-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Ort"
                    value={form.ort}
                    onChange={(e) => setForm({ ...form, ort: e.target.value })}
                    className="border p-2 w-full"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Kunde anlegen
                </button>
            </form>
        </div>
    );
}