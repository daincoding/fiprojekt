// src/pages/Firmen.jsx
import { useEffect, useState } from "react";
import { FiPlus, FiX, FiCheckCircle, FiBriefcase, FiEdit2, FiSave, FiTrash2 } from "react-icons/fi";
import { createCompany, getCompanies, updateCompany, deleteCompany } from "../hooks/api.js";

export default function Firmen() {
    const [companies, setCompanies] = useState([]);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [err, setErr] = useState("");

    const [form, setForm] = useState({
        name: "", strasse: "", plz: "", ort: "", email: "", ustIdNr: "", telefon: "", umsatzsteuer: true,
    });

    // Edit-Modell für rechte Seite
    const [edit, setEdit] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => { load(); }, []);

    async function load() {
        setErr("");
        try {
            const list = await getCompanies();
            setCompanies(list);
            if (!selected && list.length) { setSelected(list[0]); setEdit(list[0]); }
        } catch { setErr("Konnte Firmen nicht laden"); }
    }

    function update(k, v) { setForm(f => ({ ...f, [k]: v })); }
    function updateEdit(k, v) { setEdit(e => ({ ...e, [k]: v })); }

    async function onCreate(e) {
        e.preventDefault(); setSaving(true); setErr("");
        try {
            const saved = await createCompany(form);
            setSuccess(true); setOpen(false);
            setForm({ name: "", strasse: "", plz: "", ort: "", email: "", ustIdNr: "", telefon: "", umsatzsteuer: true });
            await load();
            setSelected(saved); setEdit(saved);
            setTimeout(() => setSuccess(false), 1600);
        } catch { setErr("Speichern fehlgeschlagen"); }
        finally { setSaving(false); }
    }

    async function onSaveEdit() {
        if (!selected || !edit) return;
        setSaving(true); setErr("");
        try {
            const upd = await updateCompany(selected.id, {
                name: edit.name ?? "",
                strasse: edit.strasse ?? "",
                plz: edit.plz ?? "",
                ort: edit.ort ?? "",
                email: edit.email ?? "",
                ustIdNr: edit.ustIdNr ?? "",
                telefon: edit.telefon ?? "",
                umsatzsteuer: !!edit.umsatzsteuer,
            });
            setSuccess(true);
            // Liste aktualisieren & Auswahl ersetzen
            const newList = companies.map(c => c.id === upd.id ? upd : c);
            setCompanies(newList);
            setSelected(upd);
            setEdit(upd);
            setEditing(false);
            setTimeout(() => setSuccess(false), 1600);
        } catch { setErr("Aktualisierung fehlgeschlagen"); }
        finally { setSaving(false); }
    }

    async function onDelete() {
        if (!selected) return;
        if (!confirm(`Firma „${selected.name}“ wirklich löschen?`)) return;
        setSaving(true); setErr("");
        try {
            await deleteCompany(selected.id);
            const rest = companies.filter(c => c.id !== selected.id);
            setCompanies(rest);
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
                    <FiBriefcase className="opacity-90" /> Firmen
                </h1>
                <div className="flex items-center gap-3">
                    {success && (
                        <span className="inline-flex items-center gap-2 text-sm md:text-base text-white bg-green-600/80 px-3 py-1 rounded-full">
              <FiCheckCircle /> erledigt
            </span>
                    )}
                    <button onClick={() => setOpen(true)} className="btn btn-primary inline-flex items-center gap-2">
                        <FiPlus /> Neue Firma anlegen
                    </button>
                </div>
            </div>

            {err && <div className="badge-danger rounded-full px-3 py-1 mb-4 inline-block">{err}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Liste (1/3) */}
                <div className="md:col-span-1">
                    <div className="card p-0">
                        <div className="px-4 py-3 border-b border-default/60 font-semibold">Deine Firmen</div>
                        <ul className="max-h-[60vh] overflow-auto">
                            {companies.length === 0 && <li className="px-4 py-4 text-muted">Noch keine Firma angelegt.</li>}
                            {companies.map(c => (
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
                            <div className="text-muted">Keine Firma ausgewählt.</div>
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

                                {/* Anzeige oder Edit-Form */}
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

            {/* Modal: Neue Firma */}
            {open && (
                <div className="fixed inset-0 z-40 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
                    <div className="relative z-50 w-[92%] max-w-2xl card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Neue Firma anlegen</h3>
                            <button className="btn btn-ghost px-2 py-1" onClick={() => setOpen(false)}><FiX /></button>
                        </div>

                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onCreate}>
                            <div className="md:col-span-2">
                                <label className="form-label">Name *</label>
                                <input className="input" value={form.name} onChange={e => update("name", e.target.value)} required />
                            </div>
                            <FieldInput label="Straße" v={form.strasse} set={v => update("strasse", v)} />
                            <FieldInput label="PLZ" v={form.plz} set={v => update("plz", v)} />
                            <FieldInput label="Ort" v={form.ort} set={v => update("ort", v)} />
                            <FieldInput label="E-Mail" type="email" v={form.email} set={v => update("email", v)} />
                            <FieldInput label="Telefon" v={form.telefon} set={v => update("telefon", v)} />
                            <FieldInput label="USt-IdNr" v={form.ustIdNr} set={v => update("ustIdNr", v)} />
                            <div className="flex items-center gap-2">
                                <input id="umsatz" type="checkbox" className="h-4 w-4"
                                       checked={form.umsatzsteuer} onChange={e => update("umsatzsteuer", e.target.checked)} />
                                <label htmlFor="umsatz" className="form-label m-0">Umsatzsteuerpflichtig</label>
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
            <KV label="USt-IdNr" value={selected.ustIdNr} />
            <KV label="Umsatzsteuer" value={selected.umsatzsteuer ? "Ja" : "Nein"} />
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
            <FieldInput label="USt-IdNr" v={edit?.ustIdNr ?? ""} set={v => onChange("ustIdNr", v)} />
            <div className="flex items-center gap-2">
                <input id="umsatz_edit" type="checkbox" className="h-4 w-4"
                       checked={!!edit?.umsatzsteuer} onChange={e => onChange("umsatzsteuer", e.target.checked)} />
                <label htmlFor="umsatz_edit" className="form-label m-0">Umsatzsteuerpflichtig</label>
            </div>
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