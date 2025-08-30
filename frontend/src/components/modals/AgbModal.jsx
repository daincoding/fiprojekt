import ModalBase from "./ModalBase";

export default function AgbModal({ onClose }) {
    return (
        <ModalBase title="Allgemeine Geschäfts­bedingungen (AGB)" onClose={onClose} width="max-w-3xl">
            <div className="prose prose-invert max-w-none space-y-4">
                <p><strong>Stand:</strong> {new Date().toLocaleDateString("de-DE")}</p>
                <h4>1. Geltungsbereich</h4>
                <p>
                    Diese AGB gelten für die Nutzung der RechnungsApp und alle damit verbundenen Leistungen.
                </p>
                <h4>2. Registrierung & Nutzung</h4>
                <p>
                    Für die Nutzung sind eine Registrierung und die Angabe wahrheitsgemäßer Daten erforderlich.
                    Du bist für die Geheimhaltung deiner Zugangsdaten verantwortlich.
                </p>
                <h4>3. Leistungen</h4>
                <p>
                    Die App stellt Werkzeuge zum Erstellen, Verwalten und Exportieren von Rechnungen zur Verfügung.
                    Inhalte und Ergebnisse liegen in deiner Verantwortung.
                </p>
                <h4>4. Haftung</h4>
                <p>
                    Es wird keine Haftung für Datenverluste, Ausfälle oder fehlerhafte Eingaben übernommen,
                    außer bei Vorsatz oder grober Fahrlässigkeit.
                </p>
                <h4>5. Schlussbestimmungen</h4>
                <p>
                    Es gilt deutsches Recht. Gerichtsstand ist – soweit zulässig – der Sitz des Anbieters.
                </p>
            </div>
        </ModalBase>
    );
}