import ModalBase from "./ModalBase";

const items = [
    {
        q: "Wie erstelle ich eine neue Rechnung?",
        a: "Über „Rechnung erstellen“ – Firmendaten und Kunde wählen, Positionen eintragen, speichern und als PDF exportieren."
    },
    {
        q: "Wie lade ich ein Firmenlogo hoch?",
        a: "In „Firmen“ eine Firma wählen, auf „Bearbeiten“ klicken und unten ein Logo (PNG/JPG) hochladen."
    },
    {
        q: "Wie verschicke ich Rechnungen per Mail?",
        a: "In der Rechnungs-Übersicht kannst du pro Karte auf „Mail“ klicken oder im PDF-Preview den Mail-Button nutzen."
    },
    {
        q: "Werden USt. und Summen automatisch berechnet?",
        a: "Ja, abhängig von der Einstellung „Umsatzsteuerpflichtig“ deiner Firma werden Netto, USt. und Gesamtbetrag berechnet."
    }
];

export default function FaqModal({ onClose }) {
    return (
        <ModalBase title="Häufige Fragen (FAQ)" onClose={onClose} width="max-w-2xl">
            <div className="space-y-4">
                {items.map((it, i) => (
                    <details key={i} className="rounded-xl bg-surface/40 border border-default/40 p-4">
                        <summary className="cursor-pointer font-semibold">{it.q}</summary>
                        <p className="mt-2 text-sm text-muted">{it.a}</p>
                    </details>
                ))}
            </div>
        </ModalBase>
    );
}