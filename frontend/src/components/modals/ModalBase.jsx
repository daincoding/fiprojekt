import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ModalBase({ title, onClose, children, width = "max-w-2xl" }) {
    // Scroll im Hintergrund sperren
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal="true">
                {/* Overlay */}
                <motion.div
                    className="absolute inset-0 bg-black/60"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                />

                {/* Center wrapper */}
                <div className="relative mx-auto w-[92%] md:w-auto">
                    {/* Modal card */}
                    <motion.div
                        className={`relative z-10 ${width} mx-auto mt-10 mb-10 card`}
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.7 }}
                    >
                        <motion.div
                            className="flex items-center justify-between mb-4"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05, duration: 0.18 }}
                        >
                            {title ? <h3 className="text-xl font-semibold">{title}</h3> : <div />}
                            <button className="btn btn-ghost px-2 py-1" onClick={onClose} aria-label="Schließen">
                                <FiX />
                            </button>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.07, duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>,
        document.body
    );
}