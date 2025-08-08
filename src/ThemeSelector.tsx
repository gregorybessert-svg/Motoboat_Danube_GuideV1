import React from "react";

interface ThemeSelectorProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, setTheme }) => {
  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      style={{ marginLeft: "10px" }}
    >
      <option value="dark">🌙 Dark</option>
      <option value="ocean">🌊 Ocean</option>
      <option value="sand">🏖️ Sand</option>
    </select>
  );
};

export default ThemeSelector;
