import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate("/");
    };

    const NavLinks = () => (
        <>
            <Link to="/dashboard" className="hover:opacity-80">Dashboard</Link>
            <Link to="/firmen" className="hover:opacity-80">Firmen</Link>
            <Link to="/kunden" className="hover:opacity-80">Kunden</Link>
            <Link to="/rechnung-neu" className="hover:opacity-80">Neue Rechnung</Link>
            <Link to="/rechnungen" className="hover:opacity-80">Rechnungs Übersicht</Link>
            <Link to="/apitest" className="hover:opacity-80">API Test</Link>
        </>
    );

    return (
        <nav className="navbar sticky-top">
            <div className="container-page flex items-center justify-between gap-3">
                {/* Titel: geht zu Home (ausgeloggt) bzw. Dashboard (eingeloggt) */}
                <Link
                    to={user ? "/dashboard" : "/"}
                    className="font-bold text-white text-lg md:text-xl tracking-wide"
                >
                    Rechnungsgenerator
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-6 text-sm md:text-base font-medium">
                    {!user ? (
                        <>
                            <Link to="/" className="hover:opacity-80">Home</Link>
                            <Link to="/login" className="hover:opacity-80">Login</Link>
                            <Link to="/register" className="hover:opacity-80">Registrieren</Link>
                        </>
                    ) : (
                        <>
                            <NavLinks />
                            <span className="text-xs md:text-sm opacity-90">| {user.email}</span>
                            {/* sichtbarer Logout auf roter Navbar */}
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 rounded-xl border border-white/80 text-white text-xs md:text-sm hover:bg-white/15"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Toggle – NUR mobil sichtbar */}
                <button
                    className="inline-flex md:hidden px-3 py-1 rounded-xl border border-white/70 text-white text-sm"
                    onClick={() => setOpen(!open)}
                    aria-label="Menü"
                >
                    ☰
                </button>
            </div>

            {/* Mobile Dropdown */}
            {open && (
                <div className="md:hidden border-t border-default">
                    <div className="container-page py-3 flex flex-col gap-3 text-base font-medium">
                        {!user ? (
                            <>
                                <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                                <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                                <Link to="/register" onClick={() => setOpen(false)}>Registrieren</Link>
                            </>
                        ) : (
                            <>
                                <NavLinks />
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-sm opacity-90">{user.email}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-3 py-1 rounded-xl border border-white/80 text-white text-sm hover:bg-white/15"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;