
import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="bg-surface-0 text-gray-300">
            {/* Obere Spalten */}
            <div className="container-page py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h4 className="font-semibold text-white mb-3">RechnungsApp</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="#">Über uns</Link></li>
                        <li><Link to="#">Kontakt</Link></li>
                        <li><Link to="#">FAQ</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-3">Funktionen</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/firmen">Firmen verwalten</Link></li>
                        <li><Link to="/kunden">Kunden anlegen</Link></li>
                        <li><Link to="/rechnung-neu">Rechnungen erstellen</Link></li>
                        <li><Link to="/rechnungen">Rechnungen exportieren</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-3">Rechtliches</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="#">AGB</Link></li>
                        <li><Link to="#">Datenschutz</Link></li>
                        <li><Link to="#">Impressum</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-3">Folge uns</h4>
                    <div className="flex gap-4 text-xl">
                        <a href="#" className="hover:text-white"><FiGithub /></a>
                        <a href="#" className="hover:text-white"><FiLinkedin /></a>
                        <a href="mailto:info@rechnungsapp.de" className="hover:text-white"><FiMail /></a>
                    </div>
                </div>
            </div>

            {/* Untere Zeile */}
            <div className="bg-[var(--cl-brand)] text-white text-center py-3 text-sm">
                © {new Date().getFullYear()} RechnungsApp – Alle Rechte vorbehalten
            </div>
        </footer>
    );
}