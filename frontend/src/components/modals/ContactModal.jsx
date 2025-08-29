export default function ContactModal({ onClose }) {
    return (
        <div className="modal">
            <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
            <p className="text-muted">
                Du erreichst uns jederzeit per E-Mail unter <strong>info@rechnungsapp.de</strong>. Wir antworten in der Regel innerhalb von 24 Stunden.
            </p>
            <button className="btn btn-primary mt-4" onClick={onClose}>Schließen</button>
        </div>
    );
}