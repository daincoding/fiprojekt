import { useState } from 'react';

function NeueRechnung() {
    const [formData, setFormData] = useState({
        rechnungsnummer: '',
        datum: '',
        leistung: '',
        betrag: '',
        zahlungsstatus: 'OFFEN',
        firmaId: '',
        kundeId: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Bereited die Daten für das Backend vor
        const payload = {
            rechnungsnummer: formData.rechnungsnummer,
            datum: formData.datum,
            leistung: formData.leistung,
            betrag: parseFloat(formData.betrag),
            zahlungsstatus: formData.zahlungsstatus,
            firma: { id: parseInt(formData.firmaId) },
            kunde: { id: parseInt(formData.kundeId) }
        };
        // sendet die Daten per fetch an den Spring Boot-Endpunkt
        try {
            const response = await fetch('http://localhost:8080/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Fehler beim Speichern');
            // Antwort wird als JSON gelesen und im Browser angezeigt
            const result = await response.json();
            console.log('Rechnung gespeichert:', result);
            alert('Rechnung erfolgreich erstellt!');
        } catch (error) {
            console.error(error);
            alert('Fehler beim Speichern');
        }
    };

    return (
        <div className="card max-w-xl mx-auto mt-8">
            <h2 className="text-xl font-semibold mb-4 text-muted">Neue Rechnung erstellen</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="form-label">Rechnungsnummer</label>
                    <input
                        type="text"
                        name="rechnungsnummer"
                        value={formData.rechnungsnummer}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <div>
                    <label className="form-label">Datum</label>
                    <input
                        type="date"
                        name="datum"
                        value={formData.datum}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <div>
                    <label className="form-label">Leistung</label>
                    <input
                        type="text"
                        name="leistung"
                        value={formData.leistung}
                        onChange={handleChange}
                        className="input"
                    />
                </div>

                <div>
                    <label className="form-label">Betrag (€)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="betrag"
                        value={formData.betrag}
                        onChange={handleChange}
                        className="input text-money"
                        required
                    />
                </div>

                <div>
                    <label className="form-label">Zahlungsstatus</label>
                    <select
                        name="zahlungsstatus"
                        value={formData.zahlungsstatus}
                        onChange={handleChange}
                        className="select"
                    >
                        <option value="OFFEN">OFFEN</option>
                        <option value="BEZAHLT">BEZAHLT</option>
                        <option value="STORNIERT">STORNIERT</option>
                    </select>
                </div>

                <div>
                    <label className="form-label">Firma-ID</label>
                    <input
                        type="number"
                        name="firmaId"
                        value={formData.firmaId}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <div>
                    <label className="form-label">Kunden-ID</label>
                    <input
                        type="number"
                        name="kundeId"
                        value={formData.kundeId}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4">
                    Rechnung speichern
                </button>
            </form>
        </div>
    );
}

export default NeueRechnung;