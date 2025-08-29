export default function PrivacyModal({ onClose }) {
    return (
        <div className="modal">
            <h2 className="text-xl font-semibold mb-2">Datenschutz</h2>
            <p className="text-muted">
                Der Schutz deiner Daten ist uns wichtig. RechnungsApp speichert nur die notwendigsten Informationen und gibt keine Daten an Dritte weiter.
            </p>
            <button className="btn btn-primary mt-4" onClick={onClose}>Schließen</button>
        </div>
    );
}