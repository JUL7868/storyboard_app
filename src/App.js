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

  const [activeBoard, setActiveBoard] = useState({
    id: "board-1",
    title: "Setup",
    description: "Main setup board",
    columns: [
      { id: "column-1", title: "Characters", cards: [] },
      { id: "column-2", title: "Locations", cards: [] },
    ],
  });

  // ✅ Ensure body has the current theme class on mount + theme change
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleUpdateBoard = (updatedBoard) => {
    setActiveBoard(updatedBoard);
  };

  const handleSaveBoard = () => {
    fetch("http://localhost/api.php?path=saveBoard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activeBoard),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Save success:", data);
        alert("Board saved!");
      })
      .catch((err) => console.error("Save error:", err));
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
          <Drawer
            boards={{ entities: { "board-1": activeBoard } }}
            activeBoardId={activeBoard.id}
            onSelect={() => {}}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="app-header">
          <h1>Storyboarder</h1>
        </header>
        <Board board={activeBoard} onUpdateBoard={handleUpdateBoard} />
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
