export default function FaqModal({ onClose }) {
    return (
        <div className="modal">
            <h2 className="text-xl font-semibold mb-2">FAQ</h2>
            <p className="text-muted">
                <strong>Wie kann ich eine Rechnung erstellen?</strong><br />
                Gehe auf „Rechnung erstellen“ und fülle die Felder aus. Du kannst die Rechnung anschließend als PDF exportieren.
            </p>
            <button className="btn btn-primary mt-4" onClick={onClose}>Schließen</button>
        </div>
    );
}