import React from "react";
import Footer from "../components/Footer"; // Footer importieren

const ApiTest = () => {
    return (
        <div className="container-page">
            <h1 className="text-3xl font-bold">API Test Seite</h1>
            <p className="text-muted mt-2">
                Hier können später die API Hooks ausprobiert werden.
            </p>

            {/* Test: Footer anzeigen */}
            <div className="mt-10">
                <Footer />
            </div>
        </div>
    );
};

export default ApiTest;