import React from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiUsers, FiHome, FiDownload } from "react-icons/fi";
import { FaBuilding, FaRegCheckCircle } from "react-icons/fa";
import Footer from "../components/Footer.jsx";
import { motion } from "framer-motion";

const Home = () => {
    return (
        <motion.div
            className="min-h-screen flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <main className="flex-1">
                {/* Hero */}
                <motion.section
                    className="container-page py-12 md:py-16 text-center"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className="max-w-3xl mx-auto">
                        <motion.h1
                            className="text-3xl md:text-5xl font-extrabold leading-tight"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                        >
            <span className="inline-flex items-center justify-center gap-2">
              <motion.span
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="inline-flex"
              >
                <FiHome className="text-cl-brand text-4xl" />
              </motion.span>
              Rechnungsgenerator
            </span>
                            <br className="hidden md:block" />
                            <motion.span
                                className="text-money block"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.45 }}
                            >
                                Schnell. Einfach. Digital.
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            className="text-lg text-muted mt-4"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.28, duration: 0.45 }}
                        >
                            Mit dem <strong>Rechnungsgenerator</strong> kannst du deine Firma anlegen,
                            Kunden verwalten und professionelle Rechnungen in Sekunden erstellen –
                            inklusive <em>PDF-Export</em>.
                        </motion.p>

                        <motion.div
                            className="mt-6 flex flex-wrap justify-center gap-3"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.36, duration: 0.45 }}
                        >
                            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                <Link to="/register" className="btn btn-primary">
                                    <FaRegCheckCircle className="icon-left" /> Kostenlos starten
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                <Link to="/login" className="btn btn-outline-primary">
                                    <FiHome className="icon-left" /> Login
                                </Link>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted"
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.08, delayChildren: 0.45 }
                                }
                            }}
                        >
                            {[
                                { icon: <FaBuilding />, text: "Alle Rechnungen", cls: "badge-success" },
                                { icon: <FiDownload />, text: "PDF-Export", cls: "badge-info" },
                                { icon: <FiUsers />, text: "Kunden Übersicht", cls: "badge-success" },
                            ].map((b, i) => (
                                <motion.div
                                    key={i}
                                    className={`${b.cls} rounded-full flex items-center gap-1`}
                                    variants={{ hidden: { y: 6, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                                    whileHover={{ y: -2 }}
                                >
                                    {b.icon} {b.text}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* Feature Cards */}
                <section className="container-page grid md:grid-cols-3 gap-6 pb-12">
                    {[
                        {
                            title: (
                                <>
                                    <FaBuilding className="text-cl-brand" /> Firma &amp; Branding
                                </>
                            ),
                            text: "Firmenprofil mit Adresse, USt-ID und Logo. Automatische Übernahme in jede Rechnung."
                        },
                        {
                            title: (
                                <>
                                    <FiUsers className="text-cl-brand" /> Kundenverwaltung
                                </>
                            ),
                            text: "Kunden anlegen, bearbeiten und wiederverwenden. Mit Suche &amp; Filter."
                        },
                        {
                            title: (
                                <>
                                    <FiFileText className="text-cl-brand" /> Rechnungen &amp; PDF
                                </>
                            ),
                            text:
                                "Positionen mit Netto/Brutto, MwSt., Fälligkeitsdatum &amp; Status (Entwurf, Offen, Bezahlt). Export als PDF."
                        }
                    ].map((c, i) => (
                        <motion.div
                            key={i}
                            className="card text-left"
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: 0.1 * i, duration: 0.45 }}
                            whileHover={{ y: -4, boxShadow: "0px 8px 30px rgba(0,0,0,0.25)" }}
                        >
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                {c.title}
                            </h3>
                            <p className="text-muted">{c.text}</p>
                        </motion.div>
                    ))}
                </section>
            </main>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <Footer />
            </motion.div>
        </motion.div>
    );
};

export default Home;