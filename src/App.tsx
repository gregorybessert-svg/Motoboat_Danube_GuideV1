import React, { useState, useEffect } from "react";
import "./styles.css";
import { donauData2 as donauData } from "./donauData2";
import WelcomePage from "./WelcomePage";
import ThemeSelector from "./ThemeSelector";

// 🔧 Normalisieren (Diakritika entfernen, lowercase)
const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

// 🔢 KM/Distanz-Format: 1 Nachkommastelle, Komma statt Punkt (z. B. 1567,5)
const formatNumber = (n: number | string) => {
  if (n === null || n === undefined) return "–";
  const num = typeof n === "string" ? Number(n) : n;
  if (Number.isNaN(num)) return "–";
  return num.toFixed(1).replace(".", ",");
};

type DonauPoint = (typeof donauData)[number];

export default function App() {
  // Welcome
  const [showWelcome, setShowWelcome] = useState(true);

  // Theme
  const [theme, setTheme] = useState("dark");

  // Suche/Filter
  const [search, setSearch] = useState("");
  const [kmMin, setKmMin] = useState(0);
  const [kmMax, setKmMax] = useState(3000);
  const [poiCategory, setPoiCategory] = useState("alle");
  const [uferFilter, setUferFilter] = useState("beide");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("km");
  const [result, setResult] = useState<DonauPoint[]>([]);

  // Init
  useEffect(() => {
    const hideWelcomeFlag = localStorage.getItem("hideWelcome");
    const savedTheme = localStorage.getItem("theme");
    if (hideWelcomeFlag === "true") setShowWelcome(false);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Theme anwenden
  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Filtern/Sortieren
  const handleSearch = () => {
    const query = normalize(search.trim());
    const poiFilter = normalize(poiCategory);

    const filtered = donauData.filter((entry) => {
      const inKmRange = entry.km >= kmMin && entry.km <= kmMax;

      // Teilwort-Match (case-insensitive) auf beiden Ufern
      const matchesCategory =
        poiCategory === "alle" ||
        normalize(entry.rechts || "").includes(poiFilter) ||
        normalize(entry.links || "").includes(poiFilter);

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
    }, 80);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (showWelcome) {
    return <WelcomePage onContinue={() => setShowWelcome(false)} />;
  }

  return (
    <div className="App">
      {/* Kopfbereich an „alte schwarze Version“ angelehnt */}
      <header className="app-header">
        <div className="brand">
          <img src="/logo2.png" alt="BE & GREG SAILORS" className="app-logo" />
          <h1 className="app-title">Stromkilometer-Suche</h1>
        </div>
        <div className="app-actions">
          <button onClick={() => setShowWelcome(true)}>ℹ️ Info</button>
          <ThemeSelector theme={theme} setTheme={setTheme} />
        </div>
      </header>

      {/* Such- und Filterbedienung */}
      <section className="controls">
        <div className="search-row">
          <input
            placeholder="Stromkilometer oder Ortsname eingeben"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="primary" onClick={handleSearch}>
            🔍 Suchen
          </button>
        </div>

        <div className="filters">
          <label>
            KM von:
            <input
              type="number"
              inputMode="numeric"
              value={kmMin}
              onChange={(e) => setKmMin(Number(e.target.value))}
            />
          </label>
          <label>
            bis:
            <input
              type="number"
              inputMode="numeric"
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
      </section>

      {/* Ergebnisse */}
      <section id="results">
        {result.length > 0 ? (
          <div className="results">
            <h2>📍 {result.length} Ergebnisse</h2>
            {result.map((r, idx) => (
              <div key={idx} className="entry">
                <div className="entry-row">
                  <span className="entry-label">KM:</span>
                  <span className="entry-value km">{formatNumber(r.km)}</span>
                </div>
                <div className="entry-row">
                  <span className="entry-label">Rechtes Ufer:</span>
                  <span className="entry-value">{r.rechts || "–"}</span>
                </div>
                <div className="entry-row">
                  <span className="entry-label">Linkes Ufer:</span>
                  <span className="entry-value">{r.links || "–"}</span>
                </div>
                <div className="entry-row">
                  <span className="entry-label">Entfernung zu Untermühl:</span>
                  <span className="entry-value">
                    {typeof r.dist === "number" ? formatNumber(r.dist) : "–"} km
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>🔍 Kein Treffer – bitte Suchbegriff oder Filter prüfen.</p>
        )}
      </section>

      {/* Fixierter „Zurück zur Suche“-Button */}
      {result.length > 0 && (
        <button className="scroll-top-button" onClick={scrollToTop}>
          ⬆️ Zurück zur Suche
        </button>
      )}
    </div>
  );
}
