import { useEffect, useState } from "react";
import { FiPlus, FiX, FiCheckCircle, FiUser, FiEdit2, FiSave, FiTrash2 } from "react-icons/fi";
import { createCustomer, getCustomers, updateCustomer, deleteCustomer, getCompanies } from "../hooks/api.js";

export default function Kunden() {
    const [customers, setCustomers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState(""); // Firma-Auswahl für Liste
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
                setSelectedCompanyId(firms[0].id); // Standard: erste Firma wählen
                await loadCustomers(firms[0].id);
            }
        } catch { setErr("Konnte Firmen nicht laden"); }
    }

    async function loadCustomers(companyId) {
        if (!companyId) return;
        setErr("");
        try {
            const list = await getCustomers(companyId);
            setCustomers(list);
            if (!selected && list.length) { setSelected(list[0]); setEdit(list[0]); }
        } catch { setErr("Konnte Kunden nicht laden"); }
    }

    function update(k, v) { setForm(f => ({ ...f, [k]: v })); }
    function updateEdit(k, v) { setEdit(e => ({ ...e, [k]: v })); }

    async function onCreate(e) {
        e.preventDefault(); setSaving(true); setErr("");
        try {
            const saved = await createCustomer(form.firmaId, {
                name: form.name,
                strasse: form.strasse,
                plz: form.plz,
                ort: form.ort,
                email: form.email,
                telefon: form.telefon,
            });
            setSuccess(true); setOpen(false);
            setForm({ name: "", strasse: "", plz: "", ort: "", email: "", telefon: "", firmaId: "" });
            await loadCustomers(form.firmaId);
            setSelected(saved); setEdit(saved);
            setTimeout(() => setSuccess(false), 1600);
        } catch { setErr("Speichern fehlgeschlagen"); }
        finally { setSaving(false); }
    }

    async function onSaveEdit() {
        if (!selected || !edit) return;
        setSaving(true); setErr("");
        try {
            const upd = await updateCustomer(selected.id, edit);
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

    return (
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
                    <button onClick={() => setOpen(true)} className="btn btn-primary inline-flex items-center gap-2">
                        <FiPlus /> Neuen Kunden anlegen
                    </button>
                </div>
            </div>

            {err && <div className="badge-danger rounded-full px-3 py-1 mb-4 inline-block">{err}</div>}

            {/* Firmen-Auswahl für Kundenliste */}
            <div className="mb-4">
                <label className="form-label">Firma wählen:</label>
                <select
                    className="input"
                    value={selectedCompanyId}
                    onChange={e => {
                        setSelectedCompanyId(e.target.value);
                        loadCustomers(e.target.value);
                    }}
                >
                    {companies.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
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
                                    <Display selected={selected} />
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
                            <FieldInput label="PLZ" v={form.plz} set={v => update("plz", v)} />
                            <FieldInput label="Ort" v={form.ort} set={v => update("ort", v)} />
                            <FieldInput label="E-Mail" type="email" v={form.email} set={v => update("email", v)} />
                            <FieldInput label="Telefon" v={form.telefon} set={v => update("telefon", v)} />

                            {/* Firma Auswahl */}
                            <div className="md:col-span-2">
                                <label className="form-label">Firma *</label>
                                <select
                                    className="input"
                                    value={form.firmaId}
                                    onChange={e => update("firmaId", e.target.value)}
                                    required
                                >
                                    <option value="">Wähle eine Firma…</option>
                                    {companies.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
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

function Display({ selected }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <KV label="Straße" value={selected.strasse} />
            <KV label="PLZ" value={selected.plz} />
            <KV label="Ort" value={selected.ort} />
            <KV label="E-Mail" value={selected.email} />
            <KV label="Telefon" value={selected.telefon} />
            <KV label="Firma-ID" value={selected.firma?.id || "—"} />
        </div>
    );
}

function EditForm({ edit, onChange }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput label="Name" required v={edit?.name ?? ""} set={v => onChange("name", v)} span2 />
            <FieldInput label="Straße" v={edit?.strasse ?? ""} set={v => onChange("strasse", v)} />
            <FieldInput label="PLZ" v={edit?.plz ?? ""} set={v => onChange("plz", v)} />
            <FieldInput label="Ort" v={edit?.ort ?? ""} set={v => onChange("ort", v)} />
            <FieldInput label="E-Mail" type="email" v={edit?.email ?? ""} set={v => onChange("email", v)} />
            <FieldInput label="Telefon" v={edit?.telefon ?? ""} set={v => onChange("telefon", v)} />
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

function FieldInput({ label, v, set, type="text", required=false, span2=false }) {
    return (
        <div className={span2 ? "md:col-span-2" : ""}>
            <label className="form-label">{label}{required && " *"}</label>
            <input className="input" type={type} value={v} onChange={e => set(e.target.value)} required={required} />
        </div>
    );
}