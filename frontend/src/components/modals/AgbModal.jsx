export default function AgbModal({ onClose }) {
    return (
        <div className="modal">
            <h2 className="text-xl font-semibold mb-2">Allgemeine Geschäftsbedingungen</h2>
            <p className="text-muted">
                Die Nutzung von RechnungsApp unterliegt unseren AGB. Mit der Registrierung akzeptierst du diese Bedingungen. Änderungen werden rechtzeitig bekanntgegeben.
            </p>
            <button className="btn btn-primary mt-4" onClick={onClose}>Schließen</button>
        </div>
    );
}