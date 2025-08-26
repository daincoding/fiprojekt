// src/hooks/api.js

const API_URL = "http://localhost:8080//api";


//  AUTHENTICATION
export const login = (credentials) =>
    fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    }).then(res => res.json());

export const registerUser = (data) =>
    fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then(res => res.json());

export const logout = () =>
    fetch(`${API_URL}/auth/logout`, { method: "POST" });

//  COMPANY
export const createCompany = (company) =>
    fetch(`${API_URL}/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
    }).then(res => res.json());

export const getCompanies = () =>
    fetch(`${API_URL}/companies`).then(res => res.json());

export const getCompany = (id) =>
    fetch(`${API_URL}/companies/${id}`).then(res => res.json());

export const updateCompany = (id, company) =>
    fetch(`${API_URL}/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
    }).then(res => res.json());

export const deleteCompany = (id) =>
    fetch(`${API_URL}/companies/${id}`, { method: "DELETE" });

//  CUSTOMERS
export const createCustomer = (customer) =>
    fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
    }).then(res => res.json());

export const getCustomers = () =>
    fetch(`${API_URL}/customers`).then(res => res.json());

export const getCustomer = (id) =>
    fetch(`${API_URL}/customers/${id}`).then(res => res.json());

export const updateCustomer = (id, customer) =>
    fetch(`${API_URL}/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
    }).then(res => res.json());

export const deleteCustomer = (id) =>
    fetch(`${API_URL}/customers/${id}`, { method: "DELETE" });

// INVOICES
export const createInvoice = (invoice) =>
    fetch(`${API_URL}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
    }).then(res => res.json());

export const getInvoices = () =>
    fetch(`${API_URL}/invoices`).then(res => res.json());

export const getInvoice = (id) =>
    fetch(`${API_URL}/invoices/${id}`).then(res => res.json());

export const updateInvoice = (id, invoice) =>
    fetch(`${API_URL}/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
    }).then(res => res.json());

export const deleteInvoice = (id) =>
    fetch(`${API_URL}/invoices/${id}`, { method: "DELETE" });

// EXPORT
export const exportInvoicePDF = (id) =>
    fetch(`${API_URL}/invoices/${id}/export/pdf`)
        .then(res => res.blob()); // Blob = Datei

// SEARCH
export const searchInvoices = (query) =>
    fetch(`${API_URL}/invoices/search?query=${query}`).then(res => res.json());

//  STATUS
export const updateInvoiceStatus = (id, status) =>
    fetch(`${API_URL}/invoices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    }).then(res => res.json());