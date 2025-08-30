// src/pages/NeueRechnung.jsx
import { useEffect, useMemo, useState } from "react";
import { FiFilePlus, FiCheckCircle, FiPlus, FiTrash2 } from "react-icons/fi";
import { getCompanies, getCustomers, createInvoice } from "../hooks/api.js";
import { motion, AnimatePresence } from "framer-motion";

export default function NeueRechnung() {
    const [companies, setCompanies] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [companyId, setCompanyId] = useState("");
    const [customerId, setCustomerId] = useState("");

    const [form, setForm] = useState({
        rechnungsnummer: "",
        datum: "",
        deadline: "",
        zahlungsstatus: "OFFEN",
    });

    // Positionen: { text, betrag }
    const [items, setItems] = useState([{ text: "", betrag: "" }]);

    const total = useMemo(
        () => items.reduce((sum, it) => sum + (parseFloat(it.betrag) || 0), 0),
        [items]
    );

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [err, setErr] = useState("");

    useEffect(() => { loadCompanies(); }, []);
    useEffect(() => {
        if (companyId) loadCustomers(companyId);
        else { setCustomers([]); setCustomerId(""); }
    }, [companyId]);

    async function loadCompanies() {
        setErr("");
        try {
            const list = await getCompanies();
            setCompanies(list);
            if (list.length) setCompanyId(String(list[0].id));
        } catch { setErr("Firmen konnten nicht geladen werden"); }
    }
    async function loadCustomers(cid) {
        setErr("");
        try {
            const list = await getCustomers(cid);
            setCustomers(list);
            setCustomerId(list.length ? String(list[0].id) : "");
        } catch { setErr("Kunden konnten nicht geladen werden"); }
    }

    function onFormChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }
    function updateItem(idx, key, val) {
        setItems(prev => prev.map((it, i) => i === idx ? { ...it, [key]: val } : it));
    }
    function addItem() { setItems(prev => [...prev, { text: "", betrag: "" }]); }
    function removeItem(idx) {
        setItems(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
    }

    async function onSubmit(e) {
        e.preventDefault();
        if (!companyId || !customerId) { setErr("Bitte Firma und Kunde wählen"); return; }
        // mindestens eine Position mit Betrag > 0
        const cleaned = items
            .map((it, i) => ({ ...it, n: i + 1, betragNum: parseFloat(it.betrag) || 0 }))
            .filter(it => it.text.trim() || it.betragNum > 0);

        if (cleaned.length === 0 || total <= 0) { setErr("Mindestens eine Position mit Betrag > 0 angeben"); return; }

        if (!form.deadline) { setErr("Bitte Deadline setzen"); return; }
        if (form.datum && form.deadline && form.deadline < form.datum) {
            setErr("Deadline darf nicht vor dem Rechnungsdatum liegen");
            return;
        }

        setSaving(true); setErr("");
        try {
            const payload = {
                rechnungsnummer: form.rechnungsnummer.trim(),
                datum: form.datum,                  // LocalDate (YYYY-MM-DD)
                deadline: form.deadline,
                leistung: cleaned.map(it =>
                    `${it.n}) ${it.text.trim() || "Position"} — ${it.betragNum.toFixed(2)} €`
                ).join("\n"),
                betrag: Number(total.toFixed(2)),                 // Gesamtbetrag
                zahlungsstatus: form.zahlungsstatus,
            };

            await createInvoice(companyId, customerId, payload);

            setSuccess(true);
            // Formular zurücksetzen (Firma/Kunde bleiben gewählt)
            setForm({ rechnungsnummer: "", datum: "", deadline: "", zahlungsstatus: "OFFEN" });
            setItems([{ text: "", betrag: "" }]);
            setTimeout(() => setSuccess(false), 1500);
        } catch {
            setErr("Speichern fehlgeschlagen");
        } finally {
            setSaving(false);
        }
    }

    return (
        <motion.div
            className="container-page max-w-3xl py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between mb-4">
                <motion.h1
                    className="text-2xl md:text-3xl font-bold inline-flex items-center gap-2"
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                >
                    <FiFilePlus className="opacity-90" /> Neue Rechnung
                </motion.h1>

                <AnimatePresence>
                    {success && (
                        <motion.span
                            className="inline-flex items-center gap-2 text-white bg-green-600/80 px-3 py-1 rounded-full"
                            initial={{ y: -8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -8, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <FiCheckCircle /> gespeichert
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {err && (
                    <motion.div
                        className="badge-danger rounded-full px-3 py-1 mb-4 inline-block"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {err}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="card"
                initial={{ y: 10, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
                    {/* Firma */}
                    <div>
                        <label className="form-label">Firma *</label>
                        <motion.select
                            className="select w-full"
                            value={companyId}
                            onChange={e => setCompanyId(e.target.value)}
                            required
                            whileFocus={{ scale: 1.01 }}
                        >
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </motion.select>
                    </div>

                    {/* Kunde */}
                    <div>
                        <label className="form-label">Kunde *</label>
                        <motion.select
                            className="select w-full"
                            value={customerId}
                            onChange={e => setCustomerId(e.target.value)}
                            required
                            disabled={!companyId || customers.length===0}
                            whileFocus={{ scale: 1.01 }}
                        >
                            {customers.length === 0
                                ? <option value="">Keine Kunden vorhanden</option>
                                : customers.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                        </motion.select>
                    </div>

                    <div className="md:col-span-1">
                        <label className="form-label">Rechnungsnummer *</label>
                        <motion.input
                            className="input"
                            name="rechnungsnummer"
                            value={form.rechnungsnummer}
                            onChange={onFormChange}
                            required
                            pattern="^[A-Za-z0-9\-]{5,}$"
                            title="Nur Buchstaben, Zahlen und Bindestriche erlaubt (mind. 5 Zeichen)"
                            placeholder="z. B. 2025-001"
                            whileFocus={{ scale: 1.01 }}
                        />
                    </div>

                    <div className="md:col-span-1">
                        <label className="form-label">Datum *</label>
                        <motion.input
                            className="input"
                            type="date"
                            name="datum"
                            value={form.datum}
                            onChange={onFormChange}
                            required
                            whileFocus={{ scale: 1.01 }}
                        />
                    </div>

                    {/* Positionen */}
                    <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                            <label className="form-label">Positionen</label>
                            <motion.button
                                type="button"
                                className="btn btn-outline-primary inline-flex items-center gap-2"
                                onClick={addItem}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiPlus /> Position hinzufügen
                            </motion.button>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence initial={false}>
                                {items.map((it, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="grid grid-cols-12 gap-2 items-center"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.18 }}
                                        layout
                                    >
                                        <div className="col-span-7 md:col-span-8">
                                            <motion.input
                                                className="input"
                                                placeholder={`Leistung ${idx + 1}`}
                                                value={it.text}
                                                onChange={e => updateItem(idx, "text", e.target.value)}
                                                whileFocus={{ scale: 1.01 }}
                                            />
                                        </div>
                                        <div className="col-span-4 md:col-span-3">
                                            <motion.input
                                                className="input text-money"
                                                type="number" step="0.01" min="0"
                                                placeholder="0,00"
                                                value={it.betrag}
                                                onChange={e => updateItem(idx, "betrag", e.target.value)}
                                                whileFocus={{ scale: 1.01 }}
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <motion.button
                                                type="button"
                                                className="btn btn-ghost text-danger"
                                                onClick={() => removeItem(idx)}
                                                whileHover={{ rotate: 10 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiTrash2 />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Summe */}
                    <motion.div
                        className="md:col-span-2 flex items-center justify-end gap-4"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-sm text-muted">Gesamtsumme</div>
                        <motion.div
                            className="px-3 py-2 rounded-xl bg-surface/30 border border-default/50 text-money font-semibold min-w-32 text-right"
                            key={total} // animiert bei Wertänderung
                            initial={{ scale: 0.98, opacity: 0.7 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        >
                            {total.toFixed(2)} €
                        </motion.div>
                    </motion.div>

                    {/* Status */}
                    <div className="md:col-span-2">
                        <label className="form-label">Zahlungsstatus</label>
                        <motion.select
                            className="select w-full"
                            name="zahlungsstatus"
                            value={form.zahlungsstatus}
                            onChange={onFormChange}
                            whileFocus={{ scale: 1.01 }}
                        >
                            <option value="OFFEN">OFFEN</option>
                            <option value="BEZAHLT">BEZAHLT</option>
                            <option value="STORNIERT">STORNIERT</option>
                        </motion.select>
                    </div>

                    {/* Deadline */}
                    <div className="md:col-span-1">
                        <label className="form-label">Fällig bis *</label>
                        <motion.input
                            className="input"
                            type="date"
                            name="deadline"
                            value={form.deadline}
                            onChange={onFormChange}
                            required
                            whileFocus={{ scale: 1.01 }}
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end pt-2">
                        <motion.button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {saving ? "Speichern…" : "Rechnung speichern"}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}