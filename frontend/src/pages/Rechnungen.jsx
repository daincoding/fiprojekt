// src/pages/Rechnungen.jsx
import { useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiClock, FiFileText, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { LuEuro } from "react-icons/lu";
import { getCompanies, getInvoices, getCustomers, updateInvoiceStatus } from "../hooks/api.js";
import InvoiceFilters from "../components/InvoiceFilters.jsx";
import InvoicePreview from "../components/InvoicePreview.jsx";

const STATI = ["OFFEN", "BEZAHLT", "STORNIERT"];

export default function Rechnungen() {
    const [companies, setCompanies] = useState([]);
    const [companyId, setCompanyId] = useState("ALL");
    const [customers, setCustomers] = useState([]);
    const [invoices, setInvoices] = useState([]);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState(false);

    const [customerId, setCustomerId] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("deadline-asc");
    const [search, setSearch] = useState("");

    const [previewId, setPreviewId] = useState(null);

    // Filter Funktionen
    const visibleInvoices = useMemo(() => {
        let arr = [...invoices];

        // Kunde
        if (customerId) {
            arr = arr.filter(i => String(i.kundeId) === String(customerId));
        }
        // Status
        if (statusFilter) {
            arr = arr.filter(i => i.zahlungsstatus === statusFilter);
        }
        // Suche Rechnungsnummer
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            arr = arr.filter(i => (i.rechnungsnummer || "").toLowerCase().includes(q));
        }
        // Sortierung
        // const toDate = s => s ? new Date(s.replaceAll(".", "-")) : new Date(0);
        const toNum  = v => typeof v === "number" ? v : parseFloat(v ?? 0);

        switch (sortBy) {
            case "deadline-asc":  arr.sort((a,b)=> (a.deadline||"").localeCompare(b.deadline||"")); break;
            case "deadline-desc": arr.sort((a,b)=> (b.deadline||"").localeCompare(a.deadline||"")); break;
            case "date-asc":      arr.sort((a,b)=> (a.datum||"").localeCompare(b.datum||"")); break;
            case "date-desc":     arr.sort((a,b)=> (b.datum||"").localeCompare(a.datum||"")); break;
            case "amount-desc":   arr.sort((a,b)=> toNum(b.betrag) - toNum(a.betrag)); break;
            case "amount-asc":    arr.sort((a,b)=> toNum(a.betrag) - toNum(b.betrag)); break;
            case "number-asc":    arr.sort((a,b)=> String(a.rechnungsnummer||"").localeCompare(String(b.rechnungsnummer||""))); break;
            case "number-desc":   arr.sort((a,b)=> String(b.rechnungsnummer||"").localeCompare(String(a.rechnungsnummer||""))); break;
            default: break;
        }
        return arr;
    }, [invoices, customerId, statusFilter, search, sortBy]);

    useEffect(() => { init(); }, []);
    useEffect(() => {
        if (companyId === "ALL") {
            loadInvoices(null);
            loadAllCustomers();
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

    async function loadAllCustomers() {
        try {
            if (!companies.length) {
                const list = await getCompanies();
                setCompanies(list);
                // und dann weiter
                const all = await fetchAllCustomers(list);
                setCustomers(all);
                return;
            }
            const all = await fetchAllCustomers(companies);
            setCustomers(all);
        } catch {
            setErr("Kunden konnten nicht geladen werden");
        }
    }

    async function fetchAllCustomers(firms) {
        const results = await Promise.all(
            firms.map(f => getCustomers(String(f.id)).catch(() => []))
        );
        const merged = [];
        const seen = new Set();
        for (const arr of results) {
            for (const k of arr) {
                if (!seen.has(k.id)) {
                    seen.add(k.id);
                    merged.push(k);
                }
            }
        }
        return merged;
    }

    const customerById = useMemo(() => {
        const map = new Map();
        customers.forEach(c => map.set(String(c.id), c));
        return map;
    }, [customers]);

    function labelForCustomer(id) {
        const k = customerById.get(String(id));
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
            <div className="mb-5 flex items-center justify-between gap-3">
                <h1 className="text-2xl md:text-3xl font-bold inline-flex items-center gap-2">
                    <FiFileText className="opacity-90" /> Rechnungs Übersicht
                </h1>

                <div className="flex items-center gap-3">
                    {ok && (
                        <span className="hidden sm:inline-flex items-center gap-2 text-white bg-green-600/80 px-3 py-1 rounded-full">
        <FiCheckCircle /> gespeichert
      </span>
                    )}
                    <button
                        className="btn btn-outline-primary inline-flex items-center gap-2"
                        onClick={() => loadInvoices(companyId === "ALL" ? null : companyId)}
                        disabled={loading}
                    >
                        <FiRefreshCw className={loading ? "animate-spin" : ""} /> Aktualisieren
                    </button>
                </div>
            </div>

            {/* Filter-Leiste: volle Breite, eigener Block */}
            <div className="mb-6">
                <InvoiceFilters
                    companies={companies}
                    customers={customers}
                    companyId={companyId}
                    onCompanyChange={setCompanyId}
                    customerId={customerId}
                    onCustomerChange={setCustomerId}
                    status={statusFilter}
                    onStatusChange={setStatusFilter}
                    sortBy={sortBy}
                    onSortByChange={setSortBy}
                    search={search}
                    onSearchChange={setSearch}
                    onClear={() => {
                        setCustomerId("");
                        setStatusFilter("");
                        setSortBy("deadline-asc");
                        setSearch("");
                    }}
                />
            </div>

            {err && <div className="badge-danger rounded-full px-3 py-1 mb-4 inline-block">{err}</div>}

            {visibleInvoices.length === 0 ? (
                <div className="card text-muted">Keine Rechnungen vorhanden.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {visibleInvoices.map(inv => (
                        <InvoiceCard
                            key={inv.id}
                            inv={inv}
                            customerName={labelForCustomer(inv.kundeId)}
                            onChangeStatus={onChangeStatus}
                            onPreview={setPreviewId}   // <-- neue Prop
                        />
                    ))}
                </div>
            )}
            <InvoicePreview
                invoiceId={previewId}
                open={!!previewId}
                onClose={() => setPreviewId(null)}
            />
        </div>

    );

}

function InvoiceCard({ inv, customerName, onChangeStatus, onPreview }) {
    const cd = useCountdown(inv.deadline, inv.zahlungsstatus);

    return (
        <div className="card h-full flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
                <div onClick={() => onPreview(inv.id)} className="cursor-pointer">
                    <div className="text-xs text-muted">Rechnung</div>
                    <div className="text-lg font-semibold">{inv.rechnungsnummer}</div>
                </div>
                <StatusSelect value={inv.zahlungsstatus} onChange={s => onChangeStatus(inv.id, s)} />
            </div>

            <Row label="Kunde" value={customerName} />
            <Row label="Datum" value={formatDate(inv.datum)} />
            <Row
                label="Fällig bis"
                value={
                    <span className="inline-flex items-center gap-2">
            {formatDate(inv.deadline)} {cd && <BadgeCountdown {...cd} />}
          </span>
                }
            />
            <Row
                label="Betrag"
                value={
                    <span className="text-money font-semibold inline-flex items-center gap-1">
            {formatMoney(inv.betrag)} <LuEuro />
          </span>
                }
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

