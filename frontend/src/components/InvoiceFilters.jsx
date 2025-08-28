import { FiSearch, FiX } from "react-icons/fi";

export default function InvoiceFilters({
                                           companies = [],
                                           customers = [],
                                           companyId, onCompanyChange,
                                           customerId, onCustomerChange,
                                           status, onStatusChange,
                                           sortBy, onSortByChange,
                                           search, onSearchChange,
                                       }) {
    return (
        <div className="card p-3 md:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">

                {/* Firma */}
                {onCompanyChange && (
                    <div className="col-span-1">
                        <label className="form-label">Firma</label>
                        <select className="select w-full"
                                value={companyId}
                                onChange={e => onCompanyChange(e.target.value)}>
                            <option value="ALL">Alle Firmen</option>
                            {companies.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                        </select>
                    </div>
                )}

                {/* Kunde */}
                <div className="col-span-1">
                    <label className="form-label">Kunde</label>
                    <select className="select w-full"
                            value={customerId}
                            onChange={e => onCustomerChange(e.target.value)}>
                        <option value="">Alle Kunden</option>
                        {customers.map(k => <option key={k.id} value={String(k.id)}>{k.name}</option>)}
                    </select>
                </div>

                {/* Status */}
                <div className="col-span-1">
                    <label className="form-label">Status</label>
                    <select className="select w-full"
                            value={status}
                            onChange={e => onStatusChange(e.target.value)}>
                        <option value="">Alle</option>
                        <option value="OFFEN">OFFEN</option>
                        <option value="BEZAHLT">BEZAHLT</option>
                        <option value="STORNIERT">STORNIERT</option>
                    </select>
                </div>

                {/* Sortierung */}
                <div className="col-span-1">
                    <label className="form-label">Sortierung</label>
                    <select className="select w-full"
                            value={sortBy}
                            onChange={e => onSortByChange(e.target.value)}>
                        <option value="deadline-asc">Fälligkeit ↑</option>
                        <option value="deadline-desc">Fälligkeit ↓</option>
                        <option value="date-asc">Datum ↑</option>
                        <option value="date-desc">Datum ↓</option>
                        <option value="amount-desc">Betrag ↓</option>
                        <option value="amount-asc">Betrag ↑</option>
                        <option value="number-asc">Re-Nr. ↑</option>
                        <option value="number-desc">Re-Nr. ↓</option>
                    </select>
                </div>

                {/* Suche */}
                <div className="sm:col-span-2 xl:col-span-2">
                    <label className="form-label">Rechnungsnummer</label>
                    <div className="relative">
                        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70" />
                        <input className="input w-full pl-9 pr-8"
                               placeholder="z. B. 2025-001"
                               value={search}
                               onChange={e => onSearchChange(e.target.value)} />
                        {search && (
                            <button type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm opacity-80 hover:opacity-100"
                                    onClick={() => onSearchChange("")}>
                                <FiX />
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}