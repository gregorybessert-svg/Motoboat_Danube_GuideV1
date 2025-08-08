// src/Help.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <h1>📖 Hilfe zur Donau Guide App</h1>

      <p>
        Diese App hilft dir, Orte und Stromkilometer entlang der Donau zu finden – nützlich für Freizeitkapitäne und Donau-Fans.
      </p>

      <h2>🛠 Funktionen</h2>
      <ul>
        <li>Stromkilometer- und Ortsnamensuche</li>
        <li>Filter: Schleusen, Tankstellen, Brücken</li>
        <li>Sortierung nach POI-Typ oder Kilometer</li>
        <li>Schnell-zurück-zur-Suche-Button</li>
      </ul>

      <h2>🧭 Bedienung</h2>
      <ul>
        <li>Suchbegriff eingeben (Kilometer oder Name)</li>
        <li>„Suchen“-Button oder Enter drücken</li>
        <li>Filter und Sortierung nutzen</li>
        <li>Zurück-zur-Suche Button benutzen</li>
      </ul>

      <button onClick={() => navigate("/")}>🔙 Zurück zur App</button>
    </div>
  );
}
