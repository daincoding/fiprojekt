export default function ImpressumModal({ onClose }) {
    return (
        <div className="modal">
            <h2 className="text-xl font-semibold mb-2">Impressum</h2>
            <p className="text-muted">
                RechnungsApp GmbH<br />
                Musterstraße 12<br />
                30159 Hannover<br />
                Geschäftsführer: Dominik Mustermann
            </p>
            <button className="btn btn-primary mt-4" onClick={onClose}>Schließen</button>
        </div>
    );
}