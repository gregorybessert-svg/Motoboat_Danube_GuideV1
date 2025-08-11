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
    <main className="welcome-container">
      <header className="logo-header">
        <img
          src="/logo2.png"
          alt="Donau Guide – Harbour Untermühl"
          className="logo"
        />
      </header>

      <h1 className="welcome-title">Willkommen zur Donau Guide</h1>

      <p className="welcome-text">
        🚤 Diese App liefert dir eine übersichtliche{" "}
        <strong>Donau-Kilometrierung</strong> mit relevanten Punkten an beiden
        Ufern.
      </p>

      <p className="welcome-text">Das findest du in der App:</p>
      <ul className="feature-list">
        <li>
          ⛴️ <strong>Schleusen</strong> & Slipstellen (für 🛶 Wassersportler)
        </li>
        <li>
          🧭 Donau-<strong>Fähren</strong> (praktisch für 🚲 🛴 Radfahrer)
        </li>
        <li>
          ⛽ <strong>Tankstellen</strong> (für ⚓ Motorbootfahrer)
        </li>
        <li>
          🌉 <strong>Brücken</strong> (nützlich für 🏛️ Behörden & 🚢
          Schifffahrt)
        </li>
        <li>
          📍 <strong>Sehenswürdigkeiten & markante Orte</strong> (für 🌍
          Reisende & 🏖 Wanderer)
        </li>
      </ul>

      <p className="welcome-text">
        📏 <strong>Besonderheit:</strong> Die Kilometrierung ist zusätzlich
        <em> ab unserem Heimathafen</em> 🏠 ➡️{" "}
        <strong>Untermühl – KM 2167,8</strong> verfügbar.
      </p>

      <p className="welcome-text">
        🗂️ Alle Einträge sind einem Donau-Kilometer zugeordnet und lassen sich
        gezielt per <strong>Filter</strong> und <strong>Sortierung</strong>{" "}
        finden.
      </p>

      <div className="welcome-checkbox">
        <label>
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={() => setDontShowAgain(!dontShowAgain)}
          />
          Nicht mehr anzeigen
        </label>
      </div>

      <button className="welcome-cta" onClick={handleStart}>
        Zur App
      </button>
    </main>
  );
};

export default WelcomePage;
