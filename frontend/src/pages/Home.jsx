import React from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiUsers, FiHome, FiDownload } from "react-icons/fi";
import { FaBuilding, FaRegCheckCircle } from "react-icons/fa";
import Footer from "../components/Footer.jsx";

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col">   {/* <-- Full-height column */}
            <main className="flex-1">                    {/* <-- Pushes footer down */}
                {/* Hero */}
                <section className="container-page py-12 md:py-16 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              <span className="inline-flex items-center justify-center gap-2">
                <FiHome className="text-cl-brand text-4xl" />
                Rechnungsgenerator
              </span>
                            <br className="hidden md:block" />
                            <span className="text-money">Schnell. Einfach. Digital.</span>
                        </h1>

                        <p className="text-lg text-muted mt-4">
                            Mit dem <strong>Rechnungsgenerator</strong> kannst du deine Firma anlegen,
                            Kunden verwalten und professionelle Rechnungen in Sekunden erstellen –
                            inklusive <em>PDF-Export</em>.
                        </p>

                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <Link to="/register" className="btn btn-primary">
                                <FaRegCheckCircle className="icon-left" /> Kostenlos starten
                            </Link>
                            <Link to="/login" className="btn btn-outline-primary">
                                <FiHome className="icon-left" /> Login
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted">
                            <div className="badge-success rounded-full flex items-center gap-1">
                                <FaBuilding /> Alle Rechnungen
                            </div>
                            <div className="badge-info rounded-full flex items-center gap-1">
                                <FiDownload /> PDF-Export
                            </div>
                            <div className="badge-success rounded-full flex items-center gap-1">
                                <FiUsers /> Kunden Übersicht
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Cards */}
                <section className="container-page grid md:grid-cols-3 gap-6 pb-12">
                    <div className="card text-left">
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <FaBuilding className="text-cl-brand" /> Firma &amp; Branding
                        </h3>
                        <p className="text-muted">
                            Firmenprofil mit Adresse, USt-ID und Logo. Automatische Übernahme in jede Rechnung.
                        </p>
                    </div>

                    <div className="card text-left">
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <FiUsers className="text-cl-brand" /> Kundenverwaltung
                        </h3>
                        <p className="text-muted">
                            Kunden anlegen, bearbeiten und wiederverwenden. Mit Suche &amp; Filter.
                        </p>
                    </div>

                    <div className="card text-left">
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <FiFileText className="text-cl-brand" /> Rechnungen &amp; PDF
                        </h3>
                        <p className="text-muted">
                            Positionen mit Netto/Brutto, MwSt., Fälligkeitsdatum &amp; Status
                            (Entwurf, Offen, Bezahlt). Export als PDF.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />   {/* <-- Always at the bottom */}
        </div>
    );
};

export default Home;