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

/* 🧩 Chip-Button (ersetzt Select/Option für schnelle Filter) */
const Chip: React.FC<{
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
}> = ({ selected, onClick, children, title }) => (
  <button
    className={`chip ${selected ? "chip--selected" : ""}`}
    aria-pressed={selected}
    onClick={onClick}
    title={title}
    type="button"
  >
    {children}
  </button>
);

/* 🧩 Einfaches Bottom-Sheet (Info & Filter) */
const BottomSheet: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}> = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div
      className="sheet"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Dialog"}
    >
      <div className="sheet__backdrop" onClick={onClose} />
      <div className="sheet__panel">
        <header className="sheet__header">
          <strong>{title || "Information"}</strong>
          <button
            className="sheet__close"
            onClick={onClose}
            aria-label="Schließen"
          >
            ×
          </button>
        </header>
        <div className="sheet__content">{children}</div>
      </div>
    </div>
  );
};

export default function App() {
  // Welcome
  const [showWelcome, setShowWelcome] = useState(true);

  // Theme
  const [theme, setTheme] = useState("dark");

  // Suche/Filter
  const [search, setSearch] = useState("");
  const [kmMin, setKmMin] = useState(0);
  const [kmMax, setKmMax] = useState(2589);
  const [poiCategory, setPoiCategory] = useState<
    "alle" | "Schleuse" | "Tankstelle" | "Brücke" | "Überhebestelle"
  >("alle");
  const [uferFilter, setUferFilter] = useState<"beide" | "rechts" | "links">(
    "beide"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"km" | "typ">("km");
  const [result, setResult] = useState<DonauPoint[]>([]);

  // UI-State
  const [showFilters, setShowFilters] = useState(false); // Filter‑Sheet
  const [showInfo, setShowInfo] = useState(false); // Info‑Sheet

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

  // Filtern/Sortieren (unverändert)
  const handleSearch = () => {
    const query = normalize(search.trim());
    const poiFilter = normalize(poiCategory);

    const filtered = donauData.filter((entry) => {
      const inKmRange = entry.km >= kmMin && entry.km <= kmMax;

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
      {/* Kopfbereich */}
      <header className="app-header">
        <div className="brand">
          <img src="/logo2.png" alt="BE & GREG SAILORS" className="app-logo" />
          <h1 className="app-title">Danube Guide</h1>
        </div>
        <div className="app-actions">
          <button onClick={() => setShowInfo(true)} aria-haspopup="dialog">
            ℹ️ Info
          </button>
          <ThemeSelector theme={theme} setTheme={setTheme} />
        </div>
      </header>

      {/* Suche */}
      <section className="controls">
        <div className="search-row">
          <input
            placeholder="Stromkilometer oder Teilwortsuche…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="primary"
            onClick={handleSearch}
            aria-label="Suchen"
          >
            🔍 Suchen
          </button>
        </div>

        {/* Quick-Filters als Chips */}
        <div className="quick-filters">
          <Chip
            selected={sortBy === "km"}
            onClick={() => setSortBy("km")}
            title="Nach Donau‑Km sortieren"
          >
            Donau‑Km
          </Chip>
          <Chip
            selected={sortBy === "typ"}
            onClick={() => setSortBy("typ")}
            title="Nach POI‑Typ sortieren"
          >
            POI‑Typ
          </Chip>

          <Chip
            selected={sortOrder === "asc"}
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            title="Richtung umschalten"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Chip>

          <Chip
            selected={uferFilter === "beide"}
            onClick={() => setUferFilter("beide")}
            title="Beide Ufer"
          >
            Beide
          </Chip>
          <Chip
            selected={uferFilter === "links"}
            onClick={() => setUferFilter("links")}
            title="Linkes Ufer"
          >
            L
          </Chip>
          <Chip
            selected={uferFilter === "rechts"}
            onClick={() => setUferFilter("rechts")}
            title="Rechtes Ufer"
          >
            R
          </Chip>

          <button
            className="chip chip--ghost"
            onClick={() => setShowFilters(true)}
            aria-haspopup="dialog"
          >
            ⚙️ Filter…
          </button>
        </div>
      </section>

      {/* Ergebnisse */}
      <section id="results">
        {result.length > 0 ? (
          <div className="results">
            <h2>
              📍 {result.length} Ergebnisse · Sortiert:{" "}
              {sortBy === "km" ? "Donau‑Km" : "POI‑Typ"}{" "}
              {sortOrder === "asc" ? "↑" : "↓"}
            </h2>
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

      {/* Sticky Bottom-Bar (ersetzt schwebenden Button) */}
      {result.length > 0 && (
        <div className="bottom-bar" role="toolbar">
          <button className="bottom-bar__btn" onClick={scrollToTop}>
            ⬆️ Nach oben
          </button>
          <button className="bottom-bar__fab" title="Neuen POI anlegen">
            ＋
          </button>
        </div>
      )}

      {/* Filter-Sheet */}
      <BottomSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter"
      >
        <div className="sheet__group">
          <label className="label">KM‑Bereich</label>
          <div className="range">
            {/* Doppelslider: robust auf Mobile */}
            <input
              type="range"
              min={0}
              max={2589}
              value={kmMin}
              onChange={(e) =>
                setKmMin(Math.min(Number(e.target.value), kmMax))
              }
            />
            <input
              type="range"
              min={0}
              max={2589}
              value={kmMax}
              onChange={(e) =>
                setKmMax(Math.max(Number(e.target.value), kmMin))
              }
            />
            <div className="range__values">
              <span>{kmMin}</span>
              <span>{kmMax}</span>
            </div>
          </div>
        </div>

        <div className="sheet__group">
          <label className="label">POI‑Typ</label>
          <div className="chip-row">
            {(
              [
                "alle",
                "Schleuse",
                "Tankstelle",
                "Brücke",
                "Überhebestelle",
              ] as const
            ).map((k) => (
              <Chip
                key={k}
                selected={poiCategory === k}
                onClick={() => setPoiCategory(k)}
              >
                {k}
              </Chip>
            ))}
          </div>
        </div>

        <div className="sheet__footer">
          <button
            className="btn-secondary"
            onClick={() => {
              setKmMin(0);
              setKmMax(2589);
              setPoiCategory("alle");
              setUferFilter("beide");
            }}
          >
            Zurücksetzen
          </button>
          <button
            className="primary"
            onClick={() => {
              setShowFilters(false);
              handleSearch();
            }}
          >
            Filter übernehmen
          </button>
        </div>
      </BottomSheet>

      {/* Info-Sheet */}
      <BottomSheet
        open={showInfo}
        onClose={() => setShowInfo(false)}
        title="Neu in Release 2"
      >
        <ul className="info-list">
          <li>WelcomePage neu gestaltet mit Emojis & Fettungen</li>
          <li>Theme‑Selector: 🌙 Dark · 🌊 Ocean · 🏖️ Sand</li>
          <li>Erweiterte POI‑Suche inkl. Teilwortsuche (case‑insensitive)</li>
        </ul>
      </BottomSheet>
    </div>
  );
}
