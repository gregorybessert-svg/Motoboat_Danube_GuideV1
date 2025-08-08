import React, { useState } from "react";

interface WelcomePageProps {
  onContinue: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onContinue }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleStart = () => {
    if (dontShowAgain) {
      localStorage.setItem("hideWelcome", "true");
    }
    onContinue();
  };

  return (
    <div className="welcome-container">
      <div className="logo-header">
        <img src="/logo2.png" alt="Donau Guide ab Untermühl" className="logo" />
      </div>

      <h1 className="welcome-title">
        Willkommen zur Donau Stromkilometer Guide ab Untermühl
      </h1>

      <p className="welcome-text">
        🚤 <strong>Willkommen an Bord!</strong>
        Diese App wurde entwickelt, um Dir <strong>schnell</strong> und{" "}
        <strong>unkompliziert</strong>
        Informationen zu besonderen Punkten entlang der Donau bereitzustellen –
        z. B. ⛴️ <strong>Schleusen</strong>, ⛽ <strong>Tankstellen</strong>, 🌉{" "}
        <strong>Brücken</strong> oder 📍 <strong>markante Orte</strong>.
      </p>

      <p className="welcome-text">
        📏 <strong>Besonderheit:</strong>
        Zusätzlich findest Du hier die Donau-Kilometrierung{" "}
        <em>ab unserem Heimathafen</em> 🏠 ➡️{" "}
        <strong>Untermühl – KM 2167,8</strong>
      </p>

      <p className="welcome-text">
        🗂️ <strong>Alle Daten</strong> sind nach Donau-Kilometrierung geordnet
        und ermöglichen eine gezielte Suche – ideal für ⚓{" "}
        <strong>Wassersportler</strong>, 🧭 <strong>Skipper</strong>, 🏛️{" "}
        <strong>Behörden</strong> oder neugierige 🌍 <strong>Reisende</strong>.
      </p>

      <div className="welcome-checkbox">
        <label>
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={() => setDontShowAgain(!dontShowAgain)}
          />
          &nbsp;Nicht mehr anzeigen
        </label>
      </div>

      <button onClick={handleStart}>Zur App</button>
    </div>
  );
};

export default WelcomePage;
