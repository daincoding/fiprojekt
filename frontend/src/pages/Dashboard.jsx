// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { FiFilePlus, FiUsers, FiClock, FiAlertTriangle, FiCheckCircle, FiXCircle, FiRefreshCw } from "react-icons/fi";
import { FaBuilding, FaEuroSign } from "react-icons/fa";
import { getInvoices, getCompanies } from "../hooks/api.js";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- small utils ---------- */
const greet = () => {
    const h = new Date().getHours();
    if (h < 5) return "Guten Abend";
    if (h < 11) return "Guten Morgen";
    if (h < 18) return "Guten Tag";
    return "Guten Abend";
};
const parseLocalDate = (str) => {
    const [y, m, d] = (str || "").split("-").map((n) => parseInt(n, 10));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
};
const startOfDay = (dt) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
const formatMoney = (n) =>
    (typeof n === "number" ? n : parseFloat(n ?? 0)).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const monthKey = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
const useNow = (ms = 1000) => {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => { const id = setInterval(() => setNow(new Date()), ms); return () => clearInterval(id); }, [ms]);
    return now;
};

/* ---------- page ---------- */
export default function Dashboard() {
    const [companies, setCompanies] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const now = useNow(1000);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const [firmen, inv] = await Promise.all([getCompanies().catch(() => []), getInvoices(null)]);
                setCompanies(firmen); setInvoices(inv);
            } catch { setErr("Daten konnten nicht geladen werden."); } finally { setLoading(false); }
        })();
    }, []);

    const kpis = useMemo(() => {
        const counts = { OFFEN: 0, BEZAHLT: 0, STORNIERT: 0 };
        let sumOffen = 0;
        invoices.forEach((i) => {
            counts[i.zahlungsstatus] = (counts[i.zahlungsstatus] || 0) + 1;
            if (i.zahlungsstatus === "OFFEN") sumOffen += Number(i.betrag || 0);
        });
        return { counts, sumOffen };
    }, [invoices]);

    const nextDue = useMemo(() =>
            invoices
                .filter((i) => i.zahlungsstatus === "OFFEN" && i.deadline)
                .sort((a, b) => (a.deadline || "").localeCompare(b.deadline || ""))
                .slice(0, 5)
        , [invoices]);

    const series = useMemo(() => {
        const map = new Map();
        const today = new Date();
        for (let back = 5; back >= 0; back--) map.set(monthKey(new Date(today.getFullYear(), today.getMonth() - back, 1)), 0);
        invoices.forEach((i) => {
            if (i.zahlungsstatus !== "OFFEN") return;
            const d = parseLocalDate(i.datum || i.deadline || ""); if (!d) return;
            const key = monthKey(new Date(d.getFullYear(), d.getMonth(), 1));
            if (map.has(key)) map.set(key, (map.get(key) || 0) + Number(i.betrag || 0));
        });
        const arr = Array.from(map.entries()).map(([key, value]) => ({ key, label: key.split("-").reverse().join("."), value }));
        const max = Math.max(1, ...arr.map((a) => a.value));
        return { data: arr, max };
    }, [invoices]);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <motion.div
                    className="container-page py-6 space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                >
                    {/* Header */}
                    <motion.div
                        className="flex items-center justify-between"
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                    >
                        <div>
                            <motion.h1
                                className="text-2xl md:text-3xl font-bold"
                                initial={{ y: 6, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.35, delay: 0.08 }}
                            >
                                {greet()}!
                            </motion.h1>
                            <motion.div
                                className="text-muted"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                            >
                                {companies.length} Firma/Firmen · {invoices.length} Rechnung/en
                            </motion.div>
                            <AnimatePresence>
                                {err && (
                                    <motion.div
                                        className="badge-danger mt-2 inline-block px-3 py-1 rounded-full"
                                        initial={{ y: -8, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -8, opacity: 0 }}
                                    >
                                        {err}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.button
                            className="btn btn-outline-primary inline-flex items-center gap-2"
                            onClick={() => window.location.reload()}
                            disabled={loading}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Aktualisieren
                        </motion.button>
                    </motion.div>

                    {/* Quick actions */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 1 },
                            show: {
                                transition: { staggerChildren: 0.06 }
                            }
                        }}
                    >
                        {[
                            { to: "/firmen", icon: <FaBuilding className="text-cl-brand" />, title: "Neue Firma anlegen", sub: "Adresse, USt-ID, Logo & Bank" },
                            { to: "/kunden", icon: <FiUsers className="text-cl-brand" />, title: "Neuen Kunden anlegen", sub: "Kontaktdaten speichern" },
                            { to: "/rechnung-neu", icon: <FiFilePlus className="text-cl-brand" />, title: "Neue Rechnung schreiben", sub: "Positionen & PDF-Export" },
                        ].map((t) => (
                            <motion.div
                                key={t.to}
                                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                            >
                                <Link to={t.to}>
                                    <motion.div
                                        className="card hover:bg-white/5 transition"
                                        whileHover={{ y: -3 }}
                                        transition={{ type: "spring", stiffness: 250, damping: 18 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-surface/40 border border-default/40">{t.icon}</div>
                                            <div>
                                                <div className="font-semibold">{t.title}</div>
                                                <div className="text-xs text-muted">{t.sub}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* KPI cards */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                        initial="hidden"
                        animate="show"
                        variants={{ hidden: { opacity: 1 }, show: { transition: { staggerChildren: 0.06 } } }}
                    >
                        {[
                            {
                                title: "Offene Rechnungen",
                                value: kpis.counts.OFFEN || 0,
                                sub: `${formatMoney(kpis.sumOffen)} € offen`,
                                icon: <FiAlertTriangle />,
                                toneCls: "text-amber-400",
                                to: "/rechnungen?status=OFFEN",
                            },
                            {
                                title: "Bezahlte Rechnungen",
                                value: kpis.counts.BEZAHLT || 0,
                                sub: "abgeschlossen",
                                icon: <FiCheckCircle />,
                                toneCls: "text-green-400",
                                to: "/rechnungen?status=BEZAHLT",
                            },
                            {
                                title: "Stornierte Rechnungen",
                                value: kpis.counts.STORNIERT || 0,
                                sub: "ohne Zahlung",
                                icon: <FiXCircle />,
                                toneCls: "text-red-400",
                                to: "/rechnungen?status=STORNIERT",
                            },
                        ].map((k) => (
                            <motion.div
                                key={k.title}
                                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                            >
                                <Link to={k.to}>
                                    <motion.div
                                        className="card flex items-center justify-between cursor-pointer hover:bg-white/5 transition"
                                        whileHover={{ y: -3 }}
                                        transition={{ type: "spring", stiffness: 250, damping: 18 }}
                                    >
                                        <div>
                                            <div className="text-xs text-muted">{k.title}</div>
                                            <div className="text-2xl font-bold">{k.value}</div>
                                            <div className="text-xs text-muted">{k.sub}</div>
                                        </div>
                                        <motion.div
                                            className={`text-3xl ${k.toneCls}`}
                                            initial={{ rotate: 0 }}
                                            whileHover={{ rotate: 8 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 12 }}
                                        >
                                            {k.icon}
                                        </motion.div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Chart + next due */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Chart */}
                        <motion.div
                            className="card"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold inline-flex items-center gap-2">
                                    <FaEuroSign /> Offene Beträge · letzte 6 Monate —{" "}
                                    <span className="text-money">{formatMoney(kpis.sumOffen)} €</span>
                                </h3>
                                <div className="text-xs text-muted">Summe pro Monat</div>
                            </div>

                            {/* MiniAreaChart with motion */}
                            <motion.svg
                                viewBox="0 0 520 160"
                                className="w-full h-44"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <rect x="1" y="1" width="518" height="158" rx="10" className="fill-none stroke-[color:var(--border-color,#2a2a2a)]" />
                                {/* Build points like your MiniAreaChart */}
                                {(() => {
                                    const W = 520, H = 160, P = 24;
                                    const step = (W - 2 * P) / Math.max(1, (series.data.length || 1) - 1);
                                    const pts = series.data.map((d, i) => ({
                                        x: P + i * step,
                                        y: P + (1 - (d.value || 0) / series.max) * (H - 2 * P),
                                        label: d.label,
                                        key: d.key
                                    }));
                                    const path = pts.length
                                        ? [`M ${pts[0].x} ${H - P}`, `L ${pts[0].x} ${pts[0].y}`, ...pts.slice(1).map(p => `L ${p.x} ${p.y}`), `L ${pts[pts.length - 1].x} ${H - P}`, "Z"].join(" ")
                                        : "";

                                    return (
                                        <>
                                            <motion.path
                                                d={path}
                                                fill="var(--cl-brand,#00A3A3)"
                                                opacity="0.25"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.6 }}
                                            />
                                            {pts.length > 1 && (
                                                <motion.polyline
                                                    points={pts.map(p => `${p.x},${p.y}`).join(" ")}
                                                    fill="none"
                                                    stroke="var(--cl-brand,#00A3A3)"
                                                    strokeWidth="2.5"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 0.6, delay: 0.05 }}
                                                />
                                            )}
                                            {pts.map((p, i) => (
                                                <motion.circle
                                                    key={i}
                                                    cx={p.x}
                                                    cy={p.y}
                                                    r="3"
                                                    fill="var(--cl-brand,#00A3A3)"
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.05 * i, type: "spring", stiffness: 260, damping: 16 }}
                                                />
                                            ))}
                                            {series.data.map((d, i) => (
                                                <text key={d.key} x={24 + i * step} y={154} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">
                                                    {d.label}
                                                </text>
                                            ))}
                                        </>
                                    );
                                })()}
                            </motion.svg>
                        </motion.div>

                        {/* Next due */}
                        <motion.div
                            className="card"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.05 }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold inline-flex items-center gap-2">
                                    <FiClock /> Nächste Fälligkeiten
                                </h3>
                                <div className="text-xs text-muted">Top 5 offene Rechnungen</div>
                            </div>

                            <AnimatePresence initial={false}>
                                {nextDue.length === 0 ? (
                                    <motion.div
                                        className="text-muted"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        Keine offenen Rechnungen mit Fälligkeitsdatum.
                                    </motion.div>
                                ) : (
                                    <motion.ul
                                        className="divide-y divide-default/40"
                                        initial="hidden"
                                        animate="show"
                                        variants={{ hidden: { opacity: 1 }, show: { transition: { staggerChildren: 0.06 } } }}
                                    >
                                        {nextDue.map((i) => (
                                            <motion.li
                                                key={i.id}
                                                className="py-3 flex items-center justify-between gap-3"
                                                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                                                exit={{ opacity: 0, y: -8 }}
                                            >
                                                <div className="min-w-0">
                                                    <div className="font-medium truncate">{i.rechnungsnummer || `#${i.id}`}</div>
                                                    <div className="text-xs text-muted">
                                                        Fällig am {new Date(i.deadline).toLocaleDateString("de-DE")} · {formatMoney(i.betrag)} €
                                                    </div>
                                                </div>
                                                <motion.div
                                                    initial={{ scale: 0.95, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                                                >
                                                    <LiveCountdown target={parseLocalDate(i.deadline)} now={now} />
                                                </motion.div>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}

/* ---------- pieces ---------- */
function Tile({ icon, title, sub }) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-surface/40 border border-default/40">{icon}</div>
            <div>
                <div className="font-semibold">{title}</div>
                <div className="text-xs text-muted">{sub}</div>
            </div>
        </div>
    );
}

function KPI({ title, value, sub, icon, tone = "default", to }) {
    const toneCls = tone === "success" ? "text-green-400" : tone === "warning" ? "text-amber-400" : tone === "danger" ? "text-red-400" : "text-cl-brand";
    const content = (
        <div className="card flex items-center justify-between cursor-pointer hover:bg-white/5 transition">
            <div>
                <div className="text-xs text-muted">{title}</div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs text-muted">{sub}</div>
            </div>
            <div className={`text-3xl ${toneCls}`}>{icon}</div>
        </div>
    );
    return to ? <Link to={to}>{content}</Link> : content;
}

/* SVG mini area chart */
function MiniAreaChart({ data, max }) {
    const W = 520, H = 160, P = 24;
    const step = (W - 2 * P) / Math.max(1, (data.length || 1) - 1);
    const pts = data.map((d, i) => ({ x: P + i * step, y: P + (1 - (d.value || 0) / max) * (H - 2 * P) }));
    const path = pts.length
        ? [`M ${pts[0].x} ${H - P}`, `L ${pts[0].x} ${pts[0].y}`, ...pts.slice(1).map(p => `L ${p.x} ${p.y}`), `L ${pts[pts.length - 1].x} ${H - P}`, "Z"].join(" ")
        : "";
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44">
            <rect x="1" y="1" width={W - 2} height={H - 2} rx="10" className="fill-none stroke-[color:var(--border-color,#2a2a2a)]" />
            <path d={path} fill="var(--cl-brand,#00A3A3)" opacity="0.25" />
            {pts.length > 1 && <polyline points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="var(--cl-brand,#00A3A3)" strokeWidth="2.5" />}
            {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--cl-brand,#00A3A3)" />)}
            {data.map((d, i) => (
                <text key={d.key} x={P + i * step} y={H - 6} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">
                    {d.label}
                </text>
            ))}
        </svg>
    );
}

/* Countdown – now always green unless overdue */
function LiveCountdown({ target, now }) {
    if (!target) return <span className="text-xs text-muted">—</span>;
    const ms = startOfDay(target) - now;
    const overdue = ms < 0;
    const abs = Math.abs(ms);
    const total = Math.floor(abs / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const txt = `${days}d ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (overdue) return <span className="badge-danger inline-flex items-center gap-1"><FiAlertTriangle /> überfällig seit {txt}</span>;
    return <span className="badge-success inline-flex items-center gap-1"><FiClock /> in {txt}</span>;
}