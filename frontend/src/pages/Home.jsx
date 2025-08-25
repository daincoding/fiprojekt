import React from "react";

const Home = () => {
    return (
        <div className="container-page space-y-8">
            <h1 className="text-3xl font-bold">Design Showcase</h1>

            <div className="space-x-4">
                <button className="btn btn-primary">Speichern</button>
                <button className="btn btn-outline-primary">Als PDF</button>
                <button className="btn btn-ghost">Abbrechen</button>
                <button className="btn btn-success">Bezahlt</button>
            </div>

            <div className="card max-w-md">
                <h2 className="text-xl font-semibold mb-2">Card Beispiel</h2>
                <p className="text-muted">So sehen unsere Oberflächen aus.</p>
            </div>

            <div className="max-w-md space-y-2">
                <label className="form-label">Kundennummer</label>
                <input className="input" placeholder="z. B. 10042" />
                <p className="form-hint">Wird auf der Rechnung angezeigt.</p>
            </div>

            <table className="table max-w-2xl">
                <thead>
                <tr>
                    <th>Rechnung</th>
                    <th>Status</th>
                    <th>Betrag</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>#2025-001</td>
                    <td><span className="badge-success">Bezahlt</span></td>
                    <td className="text-money">+1.200 €</td>
                </tr>
                <tr>
                    <td>#2025-002</td>
                    <td><span className="badge-danger">Offen</span></td>
                    <td className="text-danger">-300 €</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Home;