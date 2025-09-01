// src/App.js
import React, { useState } from "react";
import Board from "./components/Board";
import Drawer from "./components/Drawer";
import AdminDrawer from "./components/AdminDrawer";
import "./App.css";


function App() {
  const [theme, setTheme] = useState("light");
  const [showLeftDrawer, setShowLeftDrawer] = useState(true);
  const [showRightDrawer, setShowRightDrawer] = useState(true);

  const [activeBoard, setActiveBoard] = useState({
    id: "board-1",
    title: "Setup",
    description: "Main setup board",
    columns: [
      {
        id: "column-1",
        title: "Characters",
        cards: [
          { id: "card-1", title: "Hero", description: "Protagonist" },
          { id: "card-2", title: "Villain", description: "Antagonist" },
        ],
      },
      {
        id: "column-2",
        title: "Locations",
        cards: [
          { id: "card-3", title: "Village", description: "Where it begins" },
        ],
      },
    ],
  });

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
      {/* Left Drawer (collapsible) */}
      {showLeftDrawer && (
        <Drawer
          boards={{
            entities: {
              "board-1": activeBoard,
            },
          }}
          activeBoardId={activeBoard.id}
          onSelect={() => {}}
        />
      )}

      {/* Main Content */}

      <div className="main-content">
        <header className="app-header">


          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme}>
            Switch Theme
          </button>

          {/* Collapse Toggles */}
          <button
            style={{ marginLeft: "1rem" }}
            onClick={() => setShowLeftDrawer(!showLeftDrawer)}
          >
            {showLeftDrawer ? "Hide Left" : "Show Left"}
          </button>
          <button
            style={{ marginLeft: "0.5rem" }}
            onClick={() => setShowRightDrawer(!showRightDrawer)}
          >
            {showRightDrawer ? "Hide Right" : "Show Right"}
          </button>
        </header>

        {/* Board */}
        <Board board={activeBoard} onUpdateBoard={handleUpdateBoard} />
      </div>

      {/* Right Drawer (collapsible) */}
      {showRightDrawer && <AdminDrawer onSave={handleSaveBoard} />}
    </div>
  );
}

export default App;
