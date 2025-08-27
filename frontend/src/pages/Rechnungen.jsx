// src/pages/Rechnungen.jsx
import { useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiClock, FiFileText, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { LuEuro } from "react-icons/lu";
import { getCompanies, getInvoices, getCustomers, updateInvoiceStatus } from "../hooks/api.js";

const STATI = ["OFFEN", "BEZAHLT", "STORNIERT"];

export default function Rechnungen() {
    const [companies, setCompanies] = useState([]);
    const [companyId, setCompanyId] = useState("ALL");
    const [customers, setCustomers] = useState([]);
    const [invoices, setInvoices] = useState([]);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState(false);

    useEffect(() => { init(); }, []);
    useEffect(() => {
        if (companyId === "ALL") {
            setCustomers([]);              // kein Kunden-Mapping im ALL-Mode
            loadInvoices(null);            // Backend: liefert alle Rechnungen
        } else if (companyId) {
            loadCustomers(companyId);
            loadInvoices(companyId);
        } else {
            setInvoices([]); setCustomers([]);
        }
    }, [companyId]);

    async function init() {
        try {
            const list = await getCompanies();
            setCompanies(list);
            setCompanyId("ALL");           // Standard: Alle Firmen
        } catch { setErr("Firmen konnten nicht geladen werden"); }
    }
    async function loadCustomers(cid) {
        try { setCustomers(await getCustomers(cid)); }
        catch { /* ignore */ }
    }
    async function loadInvoices(cid) {
        setLoading(true); setErr("");
        try {
            const list = await getInvoices(cid);
            list.sort((a,b) => (a.deadline || a.datum || "").localeCompare(b.deadline || b.datum || ""));
            setInvoices(list);
        } catch { setErr("Rechnungen konnten nicht geladen werden"); }
        finally { setLoading(false); }
    }

    const customerById = useMemo(() => {
        const map = new Map();
        customers.forEach(c => map.set(c.id, c));
        return map;
    }, [customers]);

    function labelForCustomer(id) {
        if (companyId === "ALL") return `Kunde #${id}`; // Fallback ohne geladenen Kunden
        const k = customerById.get(id);
        return k ? k.name : `Kunde #${id}`;
    }

    async function onChangeStatus(invId, newStatus) {
        try {
            const updated = await updateInvoiceStatus(invId, newStatus);
            setInvoices(prev => prev.map(i => i.id === invId ? { ...i, zahlungsstatus: updated.zahlungsstatus ?? newStatus } : i));
            setOk(true); setTimeout(() => setOk(false), 1200);
        } catch {
            setErr("Status-Update fehlgeschlagen");
        }
    }

    return (
        <div className="container-page py-6">
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-2xl md:text-3xl font-bold inline-flex items-center gap-2">
                    <FiFileText className="opacity-90" /> Rechnungs Übersicht
                </h1>
                <div className="flex items-center gap-3">
                    {ok && (
                        <span className="inline-flex items-center gap-2 text-white bg-green-600/80 px-3 py-1 rounded-full">
              <FiCheckCircle /> gespeichert
            </span>
                    )}
                    <select
                        className="select"
                        value={companyId}
                        onChange={e => setCompanyId(e.target.value)}
                    >
                        <option value="ALL">Alle Firmen</option>
                        {companies.map(c => (
                            <option key={c.id} value={String(c.id)}>{c.name}</option>
                        ))}
                    </select>
                    <button className="btn btn-outline-primary inline-flex items-center gap-2"
                            onClick={() => loadInvoices(companyId === "ALL" ? null : companyId)}
                            disabled={loading}>
                        <FiRefreshCw className={loading ? "animate-spin" : ""} /> Aktualisieren
                    </button>
                </div>
            </div>

            {err && <div className="badge-danger rounded-full px-3 py-1 mb-4 inline-block">{err}</div>}

            {invoices.length === 0 ? (
                <div className="card text-muted">Keine Rechnungen vorhanden.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {invoices.map(inv => (
                        <InvoiceCard
                            key={inv.id}
                            inv={inv}
                            customerName={labelForCustomer(inv.kundeId)}
                            onChangeStatus={onChangeStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function InvoiceCard({ inv, customerName, onChangeStatus }) {
    const cd = useCountdown(inv.deadline, inv.zahlungsstatus);

    return (
        <div className="card h-full flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className="text-xs text-muted">Rechnung</div>
                    <div className="text-lg font-semibold">{inv.rechnungsnummer}</div>
                </div>
                <StatusSelect value={inv.zahlungsstatus} onChange={s => onChangeStatus(inv.id, s)} />
            </div>

            <Row label="Kunde" value={customerName} />
            <Row label="Datum" value={formatDate(inv.datum)} />
            <Row label="Fällig bis" value={
                <span className="inline-flex items-center gap-2">
          {formatDate(inv.deadline)} {cd && <BadgeCountdown {...cd} />}
        </span>
            } />
            <Row
                label="Betrag"
                value={<span className="text-money font-semibold inline-flex items-center gap-1">
          <LuEuro /> {formatMoney(inv.betrag)} €
        </span>}
            />
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between">
            <div className="text-xs text-muted">{label}</div>
            <div className="pl-3 text-right">{value ?? "—"}</div>
        </div>
    );
}

function StatusSelect({ value, onChange }) {
    return (
        <select className="select" value={value} onChange={e => onChange(e.target.value)}>
            {STATI.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
    );
}

/* -------- Countdown Helpers -------- */

function useCountdown(deadline, status) {
    const [now, setNow] = useState(() => new Date());
    const active = !!deadline && status !== "BEZAHLT" && status !== "STORNIERT";

    useEffect(() => {
        if (!active) return;
        const id = setInterval(() => setNow(new Date()), 60 * 1000);
        return () => clearInterval(id);
    }, [active]);

    if (!active) return null;

    const d = parseLocalDate(deadline);
    if (!d) return null;

    const days = diffDays(startOfDay(d), startOfDay(now));
    const state = days < 0 ? "overdue" : days === 0 ? "due" : "upcoming";
    return { days, state };
}

function BadgeCountdown({ days, state }) {
    if (state === "due") return (
        <span className="badge inline-flex items-center gap-1"><FiClock /> Heute fällig</span>
    );
    if (state === "overdue") return (
        <span className="badge-danger inline-flex items-center gap-1"><FiAlertTriangle /> Überfällig seit {Math.abs(days)} Tg</span>
    );
    return (
        <span className="badge-success inline-flex items-center gap-1"><FiClock /> in {days} Tg</span>
    );
}

/* -------- Utils -------- */

function parseLocalDate(str) {
    const [y, m, d] = (str || "").split("-").map(n => parseInt(n, 10));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
}
function startOfDay(dt) {
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}
function diffDays(a, b) {
    const MS = 24 * 60 * 60 * 1000;
    return Math.round((a - b) / MS);
}
function formatDate(str) {
    if (!str) return "—";
    const d = parseLocalDate(str);
    return d ? d.toLocaleDateString("de-DE") : str;
}
function formatMoney(n) {
    const num = typeof n === "number" ? n : parseFloat(n ?? 0);
    return num.toFixed(2);
}