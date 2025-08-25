import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar sticky-top">
            <div className="container-page flex items-center justify-between">
                <Link to="/" className="font-extrabold text-white text-2xl tracking-wide">
                    Rechnungsgenerator
                </Link>
                <div className="flex gap-8 text-lg font-semibold">
                    <Link to="/firmen" className="hover:opacity-80">Firmen</Link>
                    <Link to="/kunden" className="hover:opacity-80">Kunden</Link>
                    <Link to="/rechnung-neu" className="hover:opacity-80">Neue Rechnung</Link>
                    <Link to="/rechnungen" className="hover:opacity-80">Rechnungs Übersicht</Link>
                    <Link to="/apitest" className="hover:opacity-80">API Test</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;