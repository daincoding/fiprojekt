// InvoicePreview.jsx
import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { exportInvoicePDF } from "../hooks/api";
import { AnimatePresence, motion } from "framer-motion";

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
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Slide-in Panel */}
                    <motion.div
                        className="relative ml-auto w-full md:w-[900px] h-full bg-[#121212] p-4 flex flex-col gap-3 shadow-2xl"
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 40, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                            >
                                <label className="form-label m-0">Akzentfarbe</label>
                                <motion.input
                                    type="color"
                                    value={color}
                                    onChange={e => setColor(e.target.value)}
                                    className="h-8 w-12 rounded border border-default/50 bg-transparent"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                />
                            </motion.div>

                            <motion.div
                                className="flex items-center gap-2"
                                initial="hidden"
                                animate="show"
                                variants={{
                                    hidden: { opacity: 0, y: -6 },
                                    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
                                }}
                            >
                                <motion.button
                                    className="btn btn-outline-primary"
                                    onClick={onEmail}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Per E-Mail teilen
                                </motion.button>
                                <motion.button
                                    className="btn btn-primary"
                                    onClick={onDownload}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    PDF speichern
                                </motion.button>
                                <motion.button
                                    className="btn btn-ghost"
                                    onClick={onClose}
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiX />
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Preview */}
                        <motion.div
                            className="flex-1 overflow-hidden rounded-xl border border-default/40 bg-black"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                        >
                            {src ? (
                                <iframe title="invoice-pdf" src={src} className="w-full h-full" />
                            ) : (
                                <div className="p-6 text-muted">Lade Vorschau…</div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}