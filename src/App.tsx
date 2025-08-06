import React, { useState } from "react";
import "./styles.css";

import donauData from "./donauData";

const mockData = donauData;

/* ab da kann gesamte dagteninhalt im Kommentar gelöscht werden.
  const mockData = [
  { km: "2588.6", rechts: "", links: "Illermündung", dist: -420.8 },
  { km: "2588.5", rechts: "", links: "Ehem. Km Null", dist: -420.7 },
  { km: "2586.3", rechts: "Ulmer Ruderclub", links: "", dist: -418.5 },
  { km: "949.8", rechts: "Eisernes Tor", links: "", dist: 1218.0 },
  { km: "0.0", rechts: "Sulina", links: "", dist: 2167.8 },
]; */

/* neu ! hier werden koordinaten importiert */
import rawData from "./DONAUKILOMETER2OGD.json";
import { donauPoints } from "./data/donauPoints";

console.log("Erster Punkt:", donauPoints[0]);

// Beispiel: Nur Punkte mit km > 1
const filtered = donauPoints.filter((p) => p.km > 1);
/* ab da hat alles funktioniert */
export default function App() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<typeof mockData>([]);

  const handleSearch = () => {
    const query = search.toLowerCase().trim();

    const found = mockData.filter(
      (entry) =>
        entry.km.toLowerCase().includes(query) ||
        (entry.rechts && entry.rechts.toLowerCase().includes(query)) ||
        (entry.links && entry.links.toLowerCase().includes(query))
    );

    setResult(found);
  };

  return (
    <div className="App">
      <h1>🚤 Stromkilometer-Suche</h1>

      <input
        placeholder="Stromkilometer oder Ortsname eingeben"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <button onClick={handleSearch}>🔍 Suchen</button>

      {result.length > 0 ? (
        <div className="results">
          <h2>📍 Ergebnisse</h2>
          {result.map((r, idx) => (
            <div key={idx} className="entry">
              <strong>KM:</strong> {r.km}
              <br />
              <strong>Rechtes Ufer:</strong> {r.rechts || "–"}
              <br />
              <strong>Linkes Ufer:</strong> {r.links || "–"}
              <br />
              <strong>Entfernung zu Untermühl:</strong> {r.dist} km
            </div>
          ))}
        </div>
      ) : (
        <p>🔍 Kein Treffer – bitte Suchbegriff prüfen.</p>
      )}
    </div>
  );
}
