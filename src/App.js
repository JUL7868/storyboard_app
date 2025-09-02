// src/App.js
import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import Drawer from "./components/Drawer";
import AdminDrawer from "./components/AdminDrawer";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [saveTrigger, setSaveTrigger] = useState(0);

  // ✅ Ensure body has the current theme class on mount + theme change
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // ✅ Persist selected board in localStorage
  useEffect(() => {
    if (selectedBoardId) {
      localStorage.setItem("selectedBoardId", selectedBoardId);
    }
  }, [selectedBoardId]);

  // ✅ Restore last selected board on load
  useEffect(() => {
    const saved = localStorage.getItem("selectedBoardId");
    if (saved) {
      setSelectedBoardId(saved);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleSaveBoard = () => {
    setSaveTrigger((prev) => prev + 1); // signal Board to save
  };

  return (
    <div className={`app-layout ${theme}`}>
      {/* Left Drawer */}
      <div
        className={`drawer-container left ${showLeftDrawer ? "expanded" : "collapsed"}`}
      >
        <button
          className="toggle-btn"
          onClick={() => setShowLeftDrawer(!showLeftDrawer)}
        >
          {showLeftDrawer ? "×" : "☰"}
        </button>
        {showLeftDrawer && (
          <Drawer onSelect={setSelectedBoardId} />
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="app-header">
          <h1>Storyboarder</h1>
        </header>
        <Board selected={selectedBoardId} triggerSave={saveTrigger} />
      </div>

      {/* Right Drawer */}
      <div
        className={`drawer-container right ${showRightDrawer ? "expanded" : "collapsed"}`}
      >
        <button
          className="toggle-btn"
          onClick={() => setShowRightDrawer(!showRightDrawer)}
        >
          {showRightDrawer ? "×" : "☰"}
        </button>
        {showRightDrawer && (
          <AdminDrawer
            onSave={handleSaveBoard}
            onToggleTheme={toggleTheme}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}

export default App;
  