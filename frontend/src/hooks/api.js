const API_URL = "http://localhost:8080/api";

const asJson = async (res) => {
    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
    }
    return res.json();
};

const withAuth = (init = {}) => ({
    credentials: "include",
    ...init,
});

// -------- AUTH --------
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
    fetch(`${API_URL}/auth/logout`, withAuth({ method: "POST" })).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
    });

// -------- COMPANIES --------
export const createCompany = (company) =>
    fetch(`${API_URL}/companies`, withAuth({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
    })).then(asJson);

export const getCompanies = () =>
    fetch(`${API_URL}/companies`, withAuth()).then(asJson);

export const getCompany = (id) =>
    fetch(`${API_URL}/companies/${id}`, withAuth()).then(asJson);

export const updateCompany = (id, company) =>
    fetch(`${API_URL}/companies/${id}`, withAuth({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
    })).then(asJson);

export const deleteCompany = (id) =>
    fetch(`${API_URL}/companies/${id}`, withAuth({ method: "DELETE" }))
        .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });

// -------- CUSTOMERS (braucht companyId) --------
export const createCustomer = (companyId, customer) =>
    fetch(`${API_URL}/customers?companyId=${companyId}`, withAuth({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
    })).then(asJson);

export const getCustomers = (companyId) =>
    fetch(`${API_URL}/customers?companyId=${companyId}`, withAuth()).then(asJson);

export const getCustomer = (id) =>
    fetch(`${API_URL}/customers/${id}`, withAuth()).then(asJson);

export const updateCustomer = (id, customer) =>
    fetch(`${API_URL}/customers/${id}`, withAuth({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
    })).then(asJson);

export const deleteCustomer = (id) =>
    fetch(`${API_URL}/customers/${id}`, withAuth({ method: "DELETE" }))
        .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });

// -------- INVOICES --------
// create: braucht companyId + customerId (Query)
export const createInvoice = (companyId, customerId, invoice) =>
    fetch(`${API_URL}/invoices?companyId=${companyId}&customerId=${customerId}`, withAuth({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
    })).then(asJson);

// list: über companyId
export const getInvoices = (companyId) =>
    fetch(`${API_URL}/invoices?companyId=${companyId}`, withAuth()).then(asJson);

export const getInvoice = (id) =>
    fetch(`${API_URL}/invoices/${id}`, withAuth()).then(asJson);

export const updateInvoice = (id, invoice) =>
    fetch(`${API_URL}/invoices/${id}`, withAuth({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
    })).then(asJson);

export const deleteInvoice = (id) =>
    fetch(`${API_URL}/invoices/${id}`, withAuth({ method: "DELETE" }))
        .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });

// -------- EXPORT / SEARCH / STATUS (nur wenn Backend vorhanden) --------
export const exportInvoicePDF = (id) =>
    fetch(`${API_URL}/invoices/${id}/export/pdf`, withAuth())
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.blob();
        });

// Falls ihr eine Suche baut:
export const searchInvoices = (companyId, query) =>
    fetch(`${API_URL}/invoices/search?companyId=${companyId}&query=${encodeURIComponent(query)}`, withAuth())
        .then(asJson);

// Falls Status-Patch existiert:
export const updateInvoiceStatus = (id, status) =>
    fetch(`${API_URL}/invoices/${id}/status`, withAuth({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    })).then(asJson);