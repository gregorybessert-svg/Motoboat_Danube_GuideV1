import React, { useState } from "react";
import "./styles.css";
import { donauData2 as donauData } from "./donauData2";

const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

type DonauPoint = (typeof donauData)[number];

export default function App() {
  const [search, setSearch] = useState("");
  const [kmMin, setKmMin] = useState(0);
  const [kmMax, setKmMax] = useState(3000);
  const [poiCategory, setPoiCategory] = useState("alle");
  const [uferFilter, setUferFilter] = useState("beide");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("km");
  const [result, setResult] = useState<DonauPoint[]>([]);

  const handleSearch = () => {
    const query = normalize(search.trim());

    const filtered = donauData.filter((entry) => {
      const inKmRange = entry.km >= kmMin && entry.km <= kmMax;

      const matchesCategory =
        poiCategory === "alle" ||
        normalize(entry.rechts || "").includes(poiCategory) ||
        normalize(entry.links || "").includes(poiCategory);

      const matchesUfer =
        uferFilter === "beide" ||
        (uferFilter === "rechts" && entry.rechts) ||
        (uferFilter === "links" && entry.links);

      const matchesText =
        entry.km.toString().includes(query) ||
        (entry.rechts && normalize(entry.rechts).includes(query)) ||
        (entry.links && normalize(entry.links).includes(query));

      return inKmRange && matchesCategory && matchesUfer && matchesText;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "km") {
        return sortOrder === "asc" ? a.km - b.km : b.km - a.km;
      } else {
        const aType = normalize(a.rechts || a.links || "").trim();
        const bType = normalize(b.rechts || b.links || "").trim();
        return sortOrder === "asc"
          ? aType.localeCompare(bType)
          : bType.localeCompare(aType);
      }
    });

    setResult(sorted);

    setTimeout(() => {
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="App">
      <img
        src="/logo2.png"
        alt="BE & GREG SAILORS Logo"
        style={{ height: "40px", marginRight: "10px" }}
      />
      {/*<h1 style={{ fontSize: "1.6rem", textAlign: "center" }}>
        🚤 Donau StromkilometerGuide
      </h1>{" "}*/}
      <div className="logo-header">
        <h1>Stromkilometer-Suche</h1>
      </div>

      {result.length > 0 && (
        <button className="scroll-top-button" onClick={scrollToTop}>
          ⬆️ Zurück zur Suche
        </button>
      )}
      <div className="controls">
        <input
          placeholder="Stromkilometer oder Ortsname eingeben"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />

        <button onClick={handleSearch}>🔍 Suchen</button>
        <div className="filters">
          <label>
            KM von:
            <input
              type="number"
              value={kmMin}
              onChange={(e) => setKmMin(Number(e.target.value))}
            />
          </label>
          <label>
            bis:
            <input
              type="number"
              value={kmMax}
              onChange={(e) => setKmMax(Number(e.target.value))}
            />
          </label>

          <label>
            POI-Typ:
            <select
              value={poiCategory}
              onChange={(e) => setPoiCategory(e.target.value)}
            >
              <option value="alle">Alle</option>
              <option value="schleuse">Schleuse</option>
              <option value="tankstelle">Tankstelle</option>
              <option value="brücke">Brücke</option>
            </select>
          </label>

          <label>
            Ufer:
            <select
              value={uferFilter}
              onChange={(e) => setUferFilter(e.target.value)}
            >
              <option value="beide">Beide Ufer</option>
              <option value="rechts">Rechtes Donauufer</option>
              <option value="links">Linkes Donauufer</option>
            </select>
          </label>

          <label>
            Sortierung:
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">↑ Aufsteigend</option>
              <option value="desc">↓ Absteigend</option>
            </select>
          </label>

          <label>
            Sortieren nach:
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="km">Donau-Km</option>
              <option value="typ">POI-Typ</option>
            </select>
          </label>
        </div>
      </div>
      <div id="results">
        {result.length > 0 ? (
          <div className="results">
            <h2>📍 {result.length} Ergebnisse</h2>
            {result.map((r, idx) => (
              <div key={idx} className="entry">
                <strong>KM:</strong> {r.km}
                <br />
                <strong>Rechtes Ufer:</strong> {r.rechts || "–"}
                <br />
                <strong>Linkes Ufer:</strong> {r.links || "–"}
                <br />
                <strong>Entfernung zu Untermühl:</strong>{" "}
                {typeof r.dist === "number" ? r.dist.toFixed(1) : "–"} km
              </div>
            ))}

            <div className="to-top">
              <button onClick={scrollToTop}>🔝 Zurück zur Suche</button>
            </div>
          </div>
        ) : (
          <p>🔍 Kein Treffer – bitte Suchbegriff oder Filter prüfen.</p>
        )}
      </div>
    </div>
  );
}
