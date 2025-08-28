import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="bg-surface-0 text-gray-300 mt-12">
            {/* Obere Spalten */}
            <div className="container-page py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Spalte 1 */}
                <div>
                    <h4 className="font-semibold text-white mb-3">RechnungsApp</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#">Über uns</a></li>
                        <li><a href="#">Kontakt</a></li>
                        <li><a href="#">FAQ</a></li>
                    </ul>
                </div>

                {/* Spalte 2 */}
                <div>
                    <h4 className="font-semibold text-white mb-3">Funktionen</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/firmen">Firmen verwalten</a></li>
                        <li><a href="/kunden">Kunden anlegen</a></li>
                        <li><a href="/rechnung-neu">Rechnungen erstellen</a></li>
                        <li><a href="/rechnungen">Rechnungen exportieren</a></li>
                    </ul>
                </div>

                {/* Spalte 3 */}
                <div>
                    <h4 className="font-semibold text-white mb-3">Rechtliches</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#">AGB</a></li>
                        <li><a href="#">Datenschutz</a></li>
                        <li><a href="#">Impressum</a></li>
                    </ul>
                </div>

                {/* Spalte 4 */}
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