// src/hooks/api.js
const API_URL = "http://localhost:8080/api";

/* ---------- Helpers ---------- */
const asJson = async (res) => {
    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
    }
    return res.json();
};

const asBlob = async (res) => {
    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
    }
    return res.blob();
};

const withAuth = (init = {}) => ({
    credentials: "include",
    ...init,
});

/* ---------- AUTH ---------- */
export const login = (credentials) =>
    fetch(`${API_URL}/auth/login`, withAuth({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    })).then(asJson);

export const registerUser = (data) =>
    fetch(`${API_URL}/auth/register`, withAuth({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })).then(asJson);

export const logout = () =>
    fetch(`${API_URL}/auth/logout`, withAuth({ method: "POST" }))
        .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });

/* ---------- COMPANIES ---------- */
export const getCompanies = () =>
    fetch(`${API_URL}/companies`, withAuth()).then(asJson);

export const getCompany = (id) =>
    fetch(`${API_URL}/companies/${encodeURIComponent(id)}`, withAuth()).then(asJson);

export const createCompany = (company) =>
    fetch(`${API_URL}/companies`, withAuth({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
    })).then(asJson);

export const updateCompany = (id, company) =>
    fetch(`${API_URL}/companies/${encodeURIComponent(id)}`, withAuth({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
    })).then(asJson);

export const deleteCompany = (id) =>
    fetch(`${API_URL}/companies/${encodeURIComponent(id)}`, withAuth({ method: "DELETE" }))
        .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });

export const uploadCompanyLogo = (id, file) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch(`${API_URL}/companies/${encodeURIComponent(id)}/logo`, withAuth({
        method: "POST",
        body: fd,
    })).then(asJson);
};

export const toApiUrl = (path) => {
    if (!path) return path;
    return path.startsWith("/api/") ? `${API_URL}${path.slice(4)}` : path;
};

/* ---------- CUSTOMERS (pro Firma) ---------- */
export const getCustomers = (companyId) =>
    fetch(`${API_URL}/customers?companyId=${encodeURIComponent(companyId)}`, withAuth()).then(asJson);

export const getCustomer = (id) =>
    fetch(`${API_URL}/customers/${encodeURIComponent(id)}`, withAuth()).then(asJson);

export const createCustomer = (companyId, customer) =>
    fetch(`${API_URL}/customers?companyId=${encodeURIComponent(companyId)}`, withAuth({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
    })).then(asJson);

export const updateCustomer = (id, customer) =>
    fetch(`${API_URL}/customers/${encodeURIComponent(id)}`, withAuth({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
    })).then(asJson);

export const deleteCustomer = (id) =>
    fetch(`${API_URL}/customers/${encodeURIComponent(id)}`, withAuth({ method: "DELETE" }))
        .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });

/* ---------- INVOICES ---------- */
// Liste: optional companyId-Filter
export const getInvoices = (companyId) => {
    const url = companyId
        ? `${API_URL}/invoices?companyId=${encodeURIComponent(companyId)}`
        : `${API_URL}/invoices`;
    return fetch(url, withAuth()).then(asJson);
};

export const getInvoice = (id) =>
    fetch(`${API_URL}/invoices/${encodeURIComponent(id)}`, withAuth()).then(asJson);

// Create braucht companyId & customerId als Query
export const createInvoice = (companyId, customerId, invoice) =>
    fetch(`${API_URL}/invoices?companyId=${encodeURIComponent(companyId)}&customerId=${encodeURIComponent(customerId)}`, withAuth({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
    })).then(asJson);

export const updateInvoice = (id, invoice) =>
    fetch(`${API_URL}/invoices/${encodeURIComponent(id)}`, withAuth({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
    })).then(asJson);

export const deleteInvoice = (id) =>
    fetch(`${API_URL}/invoices/${encodeURIComponent(id)}`, withAuth({ method: "DELETE" }))
        .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });

/* ---------- STATUS (Variante A: /{id}/status + { status }) ---------- */
export const updateInvoiceStatus = (id, status) =>
    fetch(`${API_URL}/invoices/${encodeURIComponent(id)}/status`, withAuth({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    })).then(asJson);

/* ---------- EXPORT ---------- */
export const exportInvoicePDF = (id, color) => {
    const col = (color || "").replace("#", "");
    const url = `${API_URL}/invoices/${id}/export/pdf?color=%23${col}`; // %23 = '#'
    return fetch(url, {
        method: "GET",
        credentials: "include",
    }).then(async (res) => {
        if (!res.ok) {
            const t = await res.text().catch(() => "");
            throw new Error(t || `HTTP ${res.status}`);
        }
        return res.blob();
    });
};