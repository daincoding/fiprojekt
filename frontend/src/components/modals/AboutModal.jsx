export default function AboutModal({ onClose }) {
    return (
        <div className="modal">
            <h2 className="text-xl font-semibold mb-2">Über uns</h2>
            <p className="text-muted">
                RechnungsApp ist eine moderne Lösung zur digitalen Rechnungsverwaltung für kleine und mittlere Unternehmen. Unser Ziel ist es, Buchhaltung einfach, sicher und effizient zu gestalten.
            </p>
            <button className="btn btn-primary mt-4" onClick={onClose}>Schließen</button>
        </div>
    );
}