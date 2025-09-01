// src/App.js
import React, { useState } from "react";
import Board from "./components/Board";
import Drawer from "./components/Drawer";
import "./App.css";

function App() {
  const [selectedStoryboard, setSelectedStoryboard] = useState(null);
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    document.body.className = theme === "light" ? "dark" : "light";
  };

  return (
    <div className="app-layout">
      {/* Left drawer with nested directory */}
      <Drawer onSelect={setSelectedStoryboard} />

      {/* Right side content */}
      <div className="main-content">
        <header className="app-header">
          <h1 className="app-title">Storyboarder</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            Switch to {theme === "light" ? "Dark" : "Light"} Theme
          </button>
          {/* ✅ Removed the top logo */}
        </header>

        {/* Main board area reacts to selected storyboard */}
        <Board selected={selectedStoryboard} />
      </div>
    </div>
  );
}

export default App;
