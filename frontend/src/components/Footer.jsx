import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import AboutModal from "./modals/AboutModal";
import ContactModal from "./modals/ContactModal";
import FaqModal from "./modals/FaqModal";
import AgbModal from "./modals/AgbModal";
import PrivacyModal from "./modals/PrivacyModal";
import ImpressumModal from "./modals/ImpressumModal";

export default function Footer() {
    const [modal, setModal] = useState(null);
    const { user } = useAuth();
    const closeModal = () => setModal(null);

    return (
        <footer className="bg-surface-0 text-gray-300">
            <div className="container-page py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h4 className="font-semibold text-white mb-3">RechnungsApp</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setModal("about"); }}>Über uns</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setModal("contact"); }}>Kontakt</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setModal("faq"); }}>FAQ</a></li>
                    </ul>
                </div>
                {user && (
                <div>
                    <h4 className="font-semibold text-white mb-3">Funktionen</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/firmen">Firmen verwalten</a></li>
                        <li><a href="/kunden">Kunden anlegen</a></li>
                        <li><a href="/rechnung-neu">Rechnungen erstellen</a></li>
                        <li><a href="/rechnungen">Rechnungen exportieren</a></li>
                    </ul>
                </div>
                    )}
                <div>
                    <h4 className="font-semibold text-white mb-3">Rechtliches</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setModal("agb"); }}>AGB</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setModal("privacy"); }}>Datenschutz</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setModal("impressum"); }}>Impressum</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-3">Folge uns</h4>
                    <div className="flex gap-4 text-xl">
                        <a href="#" className="hover:text-white"><FiGithub /></a>
                        <a href="mailto:info@rechnungsapp.de" className="hover:text-white"><FiMail /></a>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--cl-brand)] text-white text-center py-3 text-sm">
                © {new Date().getFullYear()} RechnungsApp – Alle Rechte vorbehalten
            </div>

            {modal === "about" && <AboutModal onClose={closeModal} />}
            {modal === "contact" && <ContactModal onClose={closeModal} />}
            {modal === "faq" && <FaqModal onClose={closeModal} />}
            {modal === "agb" && <AgbModal onClose={closeModal} />}
            {modal === "privacy" && <PrivacyModal onClose={closeModal} />}
            {modal === "impressum" && <ImpressumModal onClose={closeModal} />}
        </footer>
    );
}