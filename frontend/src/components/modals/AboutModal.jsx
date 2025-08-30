import ModalBase from "./ModalBase.jsx";

export default function AboutModal({ onClose }) {
    return (
        <ModalBase title="Über uns" onClose={onClose}>
            <div className="space-y-4 text-sm leading-relaxed">
                <p>
                    Wir sind <strong>Alexander Panske</strong>, <strong>Dominik Richter</strong> und
                    <strong> Samer Bitar</strong> – ein engagiertes Team mit einer gemeinsamen Vision:
                    Die Verwaltung von Rechnungen, Firmen und Kunden soll nicht kompliziert, sondern klar, modern und benutzerfreundlich sein.
                </p>

                <p>
                    Mit unserer <strong>RechnungsApp</strong> möchten wir dir ein Werkzeug an die Hand geben,
                    das dir den Alltag erleichtert. Wir kombinieren technisches Know-how, Praxiserfahrung
                    und viel Leidenschaft, um ein System zu schaffen, das:
                </p>

                <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Intuitiv</strong> zu bedienen ist</li>
                    <li><strong>Schnell & zuverlässig</strong> deine Daten verarbeitet</li>
                    <li><strong>Flexibel</strong> mit deinen Anforderungen wächst</li>
                </ul>

                <p>
                    Dabei legen wir besonderen Wert auf <strong>Transparenz</strong>, <strong>Datensicherheit</strong>
                    und ein <strong>modernes Design</strong>, das Spaß bei der Nutzung macht. 🚀
                </p>

                <p>
                    Unser Ziel ist es, dass du dich nicht länger mit Papierkram und komplizierten Prozessen
                    aufhältst, sondern dich auf das Wesentliche konzentrieren kannst: <em>dein Business</em>.
                </p>

                <p className="font-semibold text-center text-cl-brand">
                    Alexander, Dominik und Samer – dein Team hinter RechnungsApp 💡
                </p>
            </div>
        </ModalBase>
    );
}