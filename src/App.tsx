import React, { useState } from "react";
import "./styles.css";

// Ursprüngliche Datenquelle verwenden
import donauData from "./donauData";

const mockData = donauData;

export default function App() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<typeof mockData>([]);

  const handleSearch = () => {
    const query = search.toLowerCase().trim();

    const found = mockData.filter(
      (entry) =>
        entry.km.toString().includes(query) ||
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
              <strong>Entfernung zu Untermühl:</strong>{" "}
              {r.dist?.toFixed(1) || "–"} km
            </div>
          ))}
        </div>
      ) : (
        <p>🔍 Kein Treffer – bitte Suchbegriff prüfen.</p>
      )}
    </div>
  );
}
