// src/pages/Kunden.jsx
import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiX, FiCheckCircle, FiUser, FiEdit2, FiSave, FiTrash2 } from "react-icons/fi";
import { createCustomer, getCustomers, updateCustomer, deleteCustomer, getCompanies } from "../hooks/api.js";
import { motion, AnimatePresence } from "framer-motion";

export default function Kunden() {
    const [customers, setCustomers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState(""); // String für Select
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [err, setErr] = useState("");

    const [form, setForm] = useState({
        name: "", strasse: "", plz: "", ort: "", email: "", telefon: "", firmaId: ""
    });

    const [edit, setEdit] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => { loadCompanies(); }, []);

    async function loadCompanies() {
        setErr("");
        try {
            const firms = await getCompanies();
            setCompanies(firms);
            if (firms.length > 0) {
                const firstId = String(firms[0].id);
                setSelectedCompanyId(firstId);
                await loadCustomers(firstId);
            }
        } catch { setErr("Konnte Firmen nicht laden"); }
    }

    async function loadCustomers(companyId) {
        if (!companyId) return;
        setErr("");
        try {
            const list = await getCustomers(companyId);
            setCustomers(list);
            // Auswahl zurücksetzen / erste setzen
            if (list.length) {
                setSelected(list[0]);
                setEdit(list[0]);
                setEditing(false);
            } else {
                setSelected(null);
                setEdit(null);
                setEditing(false);
            }
        } catch { setErr("Konnte Kunden nicht laden"); }
    }

    function update(k, v) { setForm(f => ({ ...f, [k]: v })); }
    function updateEdit(k, v) { setEdit(e => ({ ...e, [k]: v })); }

    function openCreate() {
        // Modal öffnen und firmaId vorbefüllen mit aktuell gewählter Firma
        setForm(f => ({ ...f, firmaId: selectedCompanyId || (companies[0] ? String(companies[0].id) : "") }));
        setOpen(true);
    }

    async function onCreate(e) {
        e.preventDefault(); setSaving(true); setErr("");
        try {
            const cid = form.firmaId || selectedCompanyId;
            if (!cid) throw new Error("Firma wählen");

            const payload = {
                name: form.name.trim(),
                strasse: form.strasse.trim(),
                plz: form.plz.trim(),
                ort: form.ort.trim(),
                email: form.email.trim(),
                telefon: form.telefon.trim(),
            };

            const saved = await createCustomer(cid, payload);
            setSuccess(true); setOpen(false);
            setForm({ name: "", strasse: "", plz: "", ort: "", email: "", telefon: "", firmaId: "" });

            await loadCustomers(cid);
            setSelected(saved); setEdit(saved);
            setTimeout(() => setSuccess(false), 1600);
        } catch { setErr("Speichern fehlgeschlagen"); }
        finally { setSaving(false); }
    }

    async function onSaveEdit() {
        if (!selected || !edit) return;
        setSaving(true); setErr("");
        try {
            // nur erlaubte Felder schicken
            const payload = {
                name: edit.name?.trim() ?? "",
                strasse: edit.strasse?.trim() ?? "",
                plz: edit.plz?.trim() ?? "",
                ort: edit.ort?.trim() ?? "",
                email: edit.email?.trim() ?? "",
                telefon: edit.telefon?.trim() ?? "",
            };
            const upd = await updateCustomer(selected.id, payload);
            setSuccess(true);
            const newList = customers.map(c => c.id === upd.id ? upd : c);
            setCustomers(newList);
            setSelected(upd);
            setEdit(upd);
            setEditing(false);
            setTimeout(() => setSuccess(false), 1600);
        } catch { setErr("Aktualisierung fehlgeschlagen"); }
        finally { setSaving(false); }
    }

    async function onDelete() {
        if (!selected) return;
        if (!confirm(`Kunde „${selected.name}“ wirklich löschen?`)) return;
        setSaving(true); setErr("");
        try {
            await deleteCustomer(selected.id);
            const rest = customers.filter(c => c.id !== selected.id);
            setCustomers(rest);
            const next = rest[0] ?? null;
            setSelected(next);
            setEdit(next);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 1200);
        } catch { setErr("Löschen fehlgeschlagen"); }
        finally { setSaving(false); }
    }

    const companyNameById = useMemo(() => {
        const map = new Map();
        companies.forEach(f => map.set(String(f.id), f.name));
        return map;
    }, [companies]);

    return (
        <motion.div
            className="container-page py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between mb-5">
                <motion.h1
                    className="text-2xl md:text-3xl font-bold flex items-center gap-2"
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                >
                    <FiUser className="opacity-90" /> Kunden
                </motion.h1>

                <div className="flex items-center gap-3">
                    <AnimatePresence>
                        {success && (
                            <motion.span
                                className="inline-flex items-center gap-2 text-sm md:text-base text-white bg-green-600/80 px-3 py-1 rounded-full"
                                initial={{ y: -8, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -8, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <FiCheckCircle /> erledigt
                            </motion.span>
                        )}
                    </AnimatePresence>

                    <motion.button
                        onClick={openCreate}
                        className="btn btn-primary inline-flex items-center gap-2"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <FiPlus /> Neuen Kunden anlegen
                    </motion.button>
                </div>
            </div>

            {err && (
                <motion.div
                    className="badge-danger rounded-full px-3 py-1 mb-4 inline-block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {err}
                </motion.div>
            )}

            {/* Firmen-Auswahl */}
            <motion.div className="mb-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <label className="form-label">Firma wählen:</label>
                <motion.select
                    className="select"
                    value={selectedCompanyId}
                    onChange={e => {
                        const cid = e.target.value;
                        setSelectedCompanyId(cid);
                        setSelected(null);
                        setEdit(null);
                        setEditing(false);
                        loadCustomers(cid);
                    }}
                    whileFocus={{ scale: 1.01 }}
                >
                    {companies.map(f => (
                        <option key={f.id} value={String(f.id)}>{f.name}</option>
                    ))}
                </motion.select>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Liste */}
                <motion.div
                    className="md:col-span-1"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div className="card p-0">
                        <div className="px-4 py-3 border-b border-default/60 font-semibold">Kunden</div>
                        <ul className="max-h-[60vh] overflow-auto">
                            {customers.length === 0 && (
                                <li className="px-4 py-4 text-muted">Noch kein Kunde.</li>
                            )}
                            <AnimatePresence initial={false}>
                                {customers.map(c => (
                                    <motion.li
                                        key={c.id}
                                        onClick={() => { setSelected(c); setEdit(c); setEditing(false); }}
                                        className={`px-4 py-3 cursor-pointer hover:bg-white/5 ${selected?.id === c.id ? "bg-white/10" : ""}`}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        <div className="font-medium">{c.name}</div>
                                        <div className="text-xs text-muted">{c.plz || c.ort ? `${c.plz ?? ""} ${c.ort ?? ""}` : "—"}</div>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    </div>
                </motion.div>

                {/* Details */}
                <motion.div
                    className="md:col-span-2"
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div className="card">
                        {!selected ? (
                            <motion.div className="text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                Kein Kunde ausgewählt.
                            </motion.div>
                        ) : (
                            <motion.div className="space-y-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">{selected.name}</h2>
                                    <div className="flex items-center gap-2">
                                        {!editing ? (
                                            <motion.button
                                                className="btn btn-outline-primary inline-flex items-center gap-2"
                                                onClick={() => { setEditing(true); setEdit(selected); }}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                <FiEdit2 /> Bearbeiten
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                className="btn btn-primary inline-flex items-center gap-2"
                                                onClick={onSaveEdit}
                                                disabled={saving}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                <FiSave /> {saving ? "Speichern…" : "Speichern"}
                                            </motion.button>
                                        )}
                                        <motion.button
                                            className="btn btn-ghost inline-flex items-center gap-2 text-danger"
                                            onClick={onDelete}
                                            disabled={saving}
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <FiTrash2 /> Löschen
                                        </motion.button>
                                    </div>
                                </div>

                                {!editing ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <Display
                                            selected={selected}
                                            companyName={companies.find(f => String(f.id) === String(selectedCompanyId))?.name}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                                        <EditForm edit={edit} onChange={updateEdit} />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Modal: Neuer Kunde */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-40 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/60"
                            onClick={() => setOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            className="relative z-50 w-[92%] max-w-2xl card"
                            initial={{ y: 30, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold">Neuen Kunden anlegen</h3>
                                <motion.button
                                    className="btn btn-ghost px-2 py-1"
                                    onClick={() => setOpen(false)}
                                    whileHover={{ rotate: 90 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                                >
                                    <FiX />
                                </motion.button>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onCreate}>
                                <FieldInput label="Name" required v={form.name} set={v => update("name", v)} span2 />
                                <FieldInput label="Straße" v={form.strasse} set={v => update("strasse", v)} />
                                <FieldInput label="PLZ" v={form.plz} set={v => update("plz", v)} pattern="\d{5}" title="Bitte eine gültige deutsche Postleitzahl (5 Ziffern) eingeben" />
                                <FieldInput label="Ort" v={form.ort} set={v => update("ort", v)} />
                                <FieldInput label="E-Mail" type="email" v={form.email} set={v => update("email", v)} required />
                                <FieldInput label="Telefon" v={form.telefon} set={v => update("telefon", v)} pattern="^(\+49|0)[1-9][0-9\s\\-]{3,}$" title="Bitte eine gültige deutsche Telefonnummer eingeben" />

                                {/* Firma Auswahl */}
                                <div className="md:col-span-2">
                                    <label className="form-label">Firma *</label>
                                    <select
                                        className="select"
                                        value={form.firmaId}
                                        onChange={e => update("firmaId", e.target.value)}
                                        required
                                    >
                                        <option value="">Wähle eine Firma…</option>
                                        {companies.map(f => (
                                            <option key={f.id} value={String(f.id)}>{f.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                                    <motion.button type="button" className="btn btn-ghost" onClick={() => setOpen(false)} whileHover={{ y: -2 }}>
                                        Abbrechen
                                    </motion.button>
                                    <motion.button type="submit" className="btn btn-primary" disabled={saving} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                        {saving ? "Speichern…" : "Speichern"}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );return (
        <div className="container-page py-6">
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    <FiUser className="opacity-90" /> Kunden
                </h1>
                <div className="flex items-center gap-3">
                    {success && (
                        <span className="inline-flex items-center gap-2 text-sm md:text-base text-white bg-green-600/80 px-3 py-1 rounded-full">
              <FiCheckCircle /> erledigt
            </span>
                    )}
                    <button onClick={openCreate} className="btn btn-primary inline-flex items-center gap-2">
                        <FiPlus /> Neuen Kunden anlegen
                    </button>
                </div>
            </div>

            {err && <div className="badge-danger rounded-full px-3 py-1 mb-4 inline-block">{err}</div>}

            {/* Firmen-Auswahl für Kundenliste */}
            <div className="mb-4">
                <label className="form-label">Firma wählen:</label>
                <select
                    className="select"
                    value={selectedCompanyId}
                    onChange={e => {
                        const cid = e.target.value;
                        setSelectedCompanyId(cid);
                        setSelected(null);
                        setEdit(null);
                        setEditing(false);
                        loadCustomers(cid);
                    }}
                >
                    {companies.map(f => (
                        <option key={f.id} value={String(f.id)}>{f.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Liste (1/3) */}
                <div className="md:col-span-1">
                    <div className="card p-0">
                        <div className="px-4 py-3 border-b border-default/60 font-semibold">Kunden</div>
                        <ul className="max-h-[60vh] overflow-auto">
                            {customers.length === 0 && <li className="px-4 py-4 text-muted">Noch kein Kunde.</li>}
                            {customers.map(c => (
                                <li
                                    key={c.id}
                                    onClick={() => { setSelected(c); setEdit(c); setEditing(false); }}
                                    className={`px-4 py-3 cursor-pointer hover:bg-white/5 ${selected?.id === c.id ? "bg-white/10" : ""}`}
                                >
                                    <div className="font-medium">{c.name}</div>
                                    <div className="text-xs text-muted">{c.plz || c.ort ? `${c.plz ?? ""} ${c.ort ?? ""}` : "—"}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Details (2/3) */}
                <div className="md:col-span-2">
                    <div className="card">
                        {!selected ? (
                            <div className="text-muted">Kein Kunde ausgewählt.</div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">{selected.name}</h2>
                                    <div className="flex items-center gap-2">
                                        {!editing ? (
                                            <button className="btn btn-outline-primary inline-flex items-center gap-2"
                                                    onClick={() => { setEditing(true); setEdit(selected); }}>
                                                <FiEdit2 /> Bearbeiten
                                            </button>
                                        ) : (
                                            <button className="btn btn-primary inline-flex items-center gap-2"
                                                    onClick={onSaveEdit} disabled={saving}>
                                                <FiSave /> {saving ? "Speichern…" : "Speichern"}
                                            </button>
                                        )}
                                        <button className="btn btn-ghost inline-flex items-center gap-2 text-danger"
                                                onClick={onDelete} disabled={saving}>
                                            <FiTrash2 /> Löschen
                                        </button>
                                    </div>
                                </div>

                                {!editing ? (
                                    <Display selected={selected} companyName={companyNameById.get(String(selectedCompanyId))} />
                                ) : (
                                    <EditForm edit={edit} onChange={updateEdit} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal: Neuer Kunde */}
            {open && (
                <div className="fixed inset-0 z-40 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
                    <div className="relative z-50 w-[92%] max-w-2xl card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Neuen Kunden anlegen</h3>
                            <button className="btn btn-ghost px-2 py-1" onClick={() => setOpen(false)}><FiX /></button>
                        </div>

                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onCreate}>
                            <FieldInput label="Name" required v={form.name} set={v => update("name", v)} span2 />
                            <FieldInput label="Straße" v={form.strasse} set={v => update("strasse", v)} />
                            <FieldInput label="PLZ" v={form.plz} set={v => update("plz", v)} pattern="\d{5}"
                                        title="Bitte eine gültige deutsche Postleitzahl (5 Ziffern) eingeben" />
                            <FieldInput label="Ort" v={form.ort} set={v => update("ort", v)} />
                            <FieldInput label="E-Mail" type="email" v={form.email} set={v => update("email", v)} required />
                            <FieldInput label="Telefon" v={form.telefon} set={v => update("telefon", v)} pattern="^(\+49|0)[1-9][0-9\s\-]{3,}$"
                                        title="Bitte eine gültige deutsche Telefonnummer eingeben" />

                            {/* Firma Auswahl */}
                            <div className="md:col-span-2">
                                <label className="form-label">Firma *</label>
                                <select
                                    className="select"
                                    value={form.firmaId}
                                    onChange={e => update("firmaId", e.target.value)}
                                    required
                                >
                                    <option value="">Wähle eine Firma…</option>
                                    {companies.map(f => (
                                        <option key={f.id} value={String(f.id)}>{f.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Abbrechen</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? "Speichern…" : "Speichern"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function Display({ selected, companyName }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <KV label="Firma" value={companyName || `Firma #${selected.firmaId ?? "—"}`} />
            <KV label="Straße" value={selected.strasse} />
            <KV label="PLZ" value={selected.plz} />
            <KV label="Ort" value={selected.ort} />
            <KV label="E-Mail" value={selected.email} />
            <KV label="Telefon" value={selected.telefon} />
        </div>
    );
}

function EditForm({ edit, onChange }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput label="Name" required v={edit?.name ?? ""} set={v => onChange("name", v)} span2 />
            <FieldInput label="Straße" v={edit?.strasse ?? ""} set={v => onChange("strasse", v)} />
            <FieldInput label="PLZ" v={edit?.plz ?? ""} set={v => onChange("plz", v)} pattern="\d{5}"
                        title="Bitte eine gültige deutsche Postleitzahl eingeben" />
            <FieldInput label="Ort" v={edit?.ort ?? ""} set={v => onChange("ort", v)} />
            <FieldInput label="E-Mail" type="email" v={edit?.email ?? ""} set={v => onChange("email", v)} required />
            <FieldInput label="Telefon" v={edit?.telefon ?? ""} set={v => onChange("telefon", v)} pattern="^(\+49|0)[1-9][0-9\s\-]{3,}$"
                        title="Bitte eine gültige Telefonnummer eingeben" />
        </div>
    );
}

function KV({ label, value }) {
    return (
        <div>
            <div className="text-xs text-muted mb-1">{label}</div>
            <div className="px-3 py-2 rounded-xl bg-surface/30 border border-default/50">{value || "—"}</div>
        </div>
    );
}

function FieldInput({ label, v, set, type = "text", required = false, span2 = false, pattern, title }) {
    return (
        <div className={span2 ? "md:col-span-2" : ""}>
            <label className="form-label">{label}{required && " *"}</label>
            <input
                className="input"
                type={type}
                value={v}
                onChange={e => set(e.target.value)}
                required={required}
                pattern={pattern}
                title={title}
            />
        </div>
    );
}