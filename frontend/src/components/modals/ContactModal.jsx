import { useState } from "react";
import ModalBase from "./ModalBase";

export default function ContactModal({ onClose }) {
    const [subject, setSubject] = useState("Anfrage über RechnungsApp");
    const [message, setMessage] = useState("");

    const mailto = `mailto:info@rechnungsapp.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    return (
        <ModalBase title="Kontakt" onClose={onClose} width="max-w-lg">
            <div className="space-y-4">
                <p className="text-muted">
                    Schreib uns gern eine Nachricht – dein E-Mail-Programm öffnet sich mit deinen Angaben.
                </p>
                <div className="grid gap-3">
                    <label className="form-label">Betreff</label>
                    <input className="input" value={subject} onChange={e => setSubject(e.target.value)} />

                    <label className="form-label mt-2">Nachricht</label>
                    <textarea
                        className="input min-h-[140px]"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Wie können wir helfen?"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button className="btn btn-ghost" onClick={onClose}>Abbrechen</button>
                    <a className="btn btn-primary" href={mailto}>E-Mail öffnen</a>
                </div>
            </div>
        </ModalBase>
    );
}