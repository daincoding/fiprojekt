// InvoicePreview.jsx
import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { exportInvoicePDF } from "../hooks/api";

export default function InvoicePreview({ invoiceId, open, onClose, customerEmail = "", subject = "" }) {
    const [color, setColor] = useState("#00A3A3");
    const [src, setSrc] = useState("");
    const lastUrlRef = useRef("");

    useEffect(() => {
        if (!open || !invoiceId) return;

        (async () => {
            try {
                const blob = await exportInvoicePDF(invoiceId, color);
                const url = URL.createObjectURL(blob);
                if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
                lastUrlRef.current = url;
                setSrc(url);
            } catch {
                // TODO: Fehleranzeige
            }
        })();

        return () => {
            if (lastUrlRef.current) {
                URL.revokeObjectURL(lastUrlRef.current);
                lastUrlRef.current = "";
            }
            setSrc("");
        };
    }, [open, invoiceId, color]);

    async function onDownload() {
        const blob = await exportInvoicePDF(invoiceId, color);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Rechnung-${invoiceId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Neuer Button: E-Mail mit Anhang (wenn möglich) bzw. Fallback
    async function onEmail() {
        // 1) PDF erzeugen
        const blob = await exportInvoicePDF(invoiceId, color);
        const filename = `Rechnung-${invoiceId}.pdf`;

        // 2) Versuchen, über Web Share API zu teilen (mit Datei)
        try {
            const file = new File([blob], filename, { type: "application/pdf" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: subject || `Rechnung ${invoiceId}`,
                    text: "Im Anhang finden Sie die Rechnung als PDF.",
                });
                return;
            }
        } catch {
            // still Fallback
        }

        // 3) Fallback: mailto öffnen (ohne Anhang) + Datei downloaden,
        // damit man sie im Mailprogramm schnell anhängen kann
        const mailto = [
            `mailto:${encodeURIComponent(customerEmail)}`,
            `?subject=${encodeURIComponent(subject || `Rechnung ${invoiceId}`)}`,
            `&body=${encodeURIComponent("Hallo,\n\nanbei die Rechnung als PDF.\n\nViele Grüße")}`,
        ].join("");

        // Download parallel anstoßen
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        // mailto öffnen
        window.location.href = mailto;
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative ml-auto w-full md:w-[900px] h-full bg-[#121212] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="form-label m-0">Akzentfarbe</label>
                        <input
                            type="color"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                            className="h-8 w-12 rounded border border-default/50 bg-transparent"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn btn-outline-primary" onClick={onEmail}>
                            Per E-Mail teilen
                        </button>
                        <button className="btn btn-primary" onClick={onDownload}>PDF speichern</button>
                        <button className="btn btn-ghost" onClick={onClose}><FiX /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden rounded-xl border border-default/40 bg-black">
                    {src ? (
                        <iframe title="invoice-pdf" src={src} className="w-full h-full" />
                    ) : (
                        <div className="p-6 text-muted">Lade Vorschau…</div>
                    )}
                </div>
            </div>
        </div>
    );
}