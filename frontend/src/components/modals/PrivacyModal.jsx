import ModalBase from "./ModalBase";

export default function PrivacyModal({ onClose }) {
    return (
        <ModalBase title="Datenschutzerklärung" onClose={onClose} width="max-w-3xl">
            <div className="prose prose-invert max-w-none space-y-4">
                <p>
                    Wir verarbeiten personenbezogene Daten (z. B. Name, E-Mail, Rechnungs- und Kundendaten)
                    ausschließlich zur Bereitstellung der Funktionen dieser App.
                </p>
                <h4>Rechtsgrundlage</h4>
                <p>
                    Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
                    und – falls vorhanden – deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
                </p>
                <h4>Speicherdauer</h4>
                <p>
                    Daten werden nur so lange gespeichert, wie es für die Zwecke der Verarbeitung erforderlich ist
                    bzw. gesetzliche Aufbewahrungspflichten bestehen.
                </p>
                <h4>Betroffenenrechte</h4>
                <p>
                    Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit.
                    Wende dich dazu an <a href="mailto:privacy@rechnungsapp.de">privacy@rechnungsapp.de</a>.
                </p>
                <h4>Drittanbieter & Hosting</h4>
                <p>
                    Sofern Drittanbieter eingesetzt werden, geschieht dies auf Basis von Auftragsverarbeitungsverträgen
                    gemäß Art. 28 DSGVO.
                </p>
            </div>
        </ModalBase>
    );
}