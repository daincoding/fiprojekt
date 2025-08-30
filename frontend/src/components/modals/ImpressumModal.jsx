import ModalBase from "./ModalBase";

export default function ImpressumModal({ onClose }) {
    return (
        <ModalBase title="Impressum" onClose={onClose} width="max-w-2xl">
            <div className="prose prose-invert max-w-none">
                <p><strong>Dienstanbieter:</strong><br/>RechnungsApp (Beispiel GmbH)</p>
                <p>
                    Musterstraße 12<br/>
                    12345 Musterstadt<br/>
                    Deutschland
                </p>
                <p>
                    E-Mail: info@rechnungsapp.de<br/>
                    Telefon: +49 123 456789
                </p>
                <p>
                    Vertretungsberechtigt: Max Mustermann<br/>
                    USt-IdNr.: DE123456789
                </p>
                <p>
                    Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV: Max Mustermann, Anschrift wie oben.
                </p>
            </div>
        </ModalBase>
    );
}