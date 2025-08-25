import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-gray-900 text-white p-4 flex items-center">
            {/* Logo / Titel */}
            <div className="text-xl font-bold flex-1">
                <Link to="/">Rechnungsgenerator</Link>
            </div>

            {/* Navigation Links */}
            <div className="space-x-6">
                <Link to="/firmen" className="hover:text-gray-400">
                    Firmen
                </Link>
                <Link to="/kunden" className="hover:text-gray-400">
                    Kunden
                </Link>
                <Link to="/rechnung-neu" className="hover:text-gray-400">
                    Neue Rechnung
                </Link>
                <Link to="/rechnungen" className="hover:text-gray-400">
                    Rechnungs Übersicht
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;