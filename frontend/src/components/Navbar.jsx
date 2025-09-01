import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { AnimatePresence, motion } from "framer-motion";

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
        </>
    );

    return (
        <motion.nav
            className="navbar sticky-top"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
        >
            <div className="container-page flex items-center justify-between gap-3">
                {/* Titel */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                        to={user ? "/dashboard" : "/"}
                        className="font-bold text-white text-lg md:text-xl tracking-wide flex items-center gap-2"
                    >
                        <img
                            src="/calculator.png"
                            alt="Logo"
                            className="h-6 w-6 object-contain"
                        />
                        Rechnungsgenerator
                    </Link>
                </motion.div>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-6 text-sm md:text-base font-medium">
                    {!user ? (
                        <>
                            <motion.div whileHover={{ y: -1 }}>
                                <Link to="/" className="hover:opacity-80">Home</Link>
                            </motion.div>
                            <motion.div whileHover={{ y: -1 }}>
                                <Link to="/login" className="hover:opacity-80">Login</Link>
                            </motion.div>
                            <motion.div whileHover={{ y: -1 }}>
                                <Link to="/register" className="hover:opacity-80">Registrieren</Link>
                            </motion.div>
                        </>
                    ) : (
                        <>
                            <motion.div whileHover={{ y: -1 }}><Link to="/dashboard" className="hover:opacity-80">Dashboard</Link></motion.div>
                            <motion.div whileHover={{ y: -1 }}><Link to="/firmen" className="hover:opacity-80">Firmen</Link></motion.div>
                            <motion.div whileHover={{ y: -1 }}><Link to="/kunden" className="hover:opacity-80">Kunden</Link></motion.div>
                            <motion.div whileHover={{ y: -1 }}><Link to="/rechnung-neu" className="hover:opacity-80">Neue Rechnung</Link></motion.div>
                            <motion.div whileHover={{ y: -1 }}><Link to="/rechnungen" className="hover:opacity-80">Rechnungs Übersicht</Link></motion.div>

                            <span className="text-xs md:text-sm opacity-90">| {user.email}</span>

                            <motion.button
                                onClick={handleLogout}
                                className="px-3 py-1 rounded-xl border border-white/80 text-white text-xs md:text-sm hover:bg:white/15 hover:bg-white/15"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Logout
                            </motion.button>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <motion.button
                    className="inline-flex md:hidden px-3 py-1 rounded-xl border border-white/70 text-white text-sm"
                    onClick={() => setOpen(!open)}
                    aria-label="Menü"
                    whileTap={{ scale: 0.96 }}
                    animate={{ rotate: open ? 90 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    ☰
                </motion.button>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="md:hidden border-t border-default overflow-hidden"
                        key="mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                    >
                        <div className="container-page py-3 flex flex-col gap-3 text-base font-medium">
                            {!user ? (
                                <>
                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Link to="/register" onClick={() => setOpen(false)}>Registrieren</Link>
                                    </motion.div>
                                </>
                            ) : (
                                <>
                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Link to="/firmen" onClick={() => setOpen(false)}>Firmen</Link>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Link to="/kunden" onClick={() => setOpen(false)}>Kunden</Link>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Link to="/rechnung-neu" onClick={() => setOpen(false)}>Neue Rechnung</Link>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Link to="/rechnungen" onClick={() => setOpen(false)}>Rechnungs Übersicht</Link>
                                    </motion.div>

                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-sm opacity-90">{user.email}</span>
                                        <motion.button
                                            onClick={handleLogout}
                                            className="px-3 py-1 rounded-xl border border-white/80 text-white text-sm hover:bg-white/15"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Logout
                                        </motion.button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

export default Navbar;