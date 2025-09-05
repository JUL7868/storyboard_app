// src/App.js
import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import Drawer from "./components/Drawer";
import AdminDrawer from "./components/AdminDrawer";
import LogoBlack from "./assets/logo-black.png";
import LogoWhite from "./assets/logo-white.png";

import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [refreshBoards, setRefreshBoards] = useState(0); // ✅ trigger for Drawer refresh

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    if (selectedBoardId) {
      localStorage.setItem("selectedBoardId", selectedBoardId);
    }
  }, [selectedBoardId]);

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
    setSaveTrigger((prev) => prev + 1);
  };

  const handleAddBoard = () => {
    const payload = {
      title: "New Storyboard",
      description: "This is a new storyboard.",
      columns: [] // api.php will seed defaults
    };

    fetch("http://localhost/storyboard_app/api.php?path=saveBoard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSelectedBoardId(data.id);
          setRefreshBoards((prev) => prev + 1); // ✅ refresh drawer after add
        } else {
          console.error("Failed to create board:", data.error);
        }
      })
      .catch((err) => console.error("Error creating new board:", err));
  };

  const handleDeleteBoard = () => {
    if (!selectedBoardId) return;
    if (!window.confirm("Are you sure you want to delete this storyboard?")) return;

    fetch(`http://localhost/storyboard_app/api.php?path=deleteBoard&id=${selectedBoardId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSelectedBoardId(null);
          setRefreshBoards((prev) => prev + 1); // ✅ refresh drawer after delete
        }
      })
      .catch((err) => console.error("Error deleting board:", err));
  };

  return (
    <div className={`app-layout ${theme}`}>
      {/* Left Drawer */}
      <div className={`drawer-container-left ${showLeftDrawer ? "expanded" : "collapsed"}`}>
        <Drawer
          onSelect={setSelectedBoardId}
          activeBoardId={selectedBoardId}
          refresh={refreshBoards}
          isOpen={showLeftDrawer}
          onToggle={() => setShowLeftDrawer(!showLeftDrawer)}
        />
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
          {/* Left: Logo */}
          <div className="flex items-center">
            <img
              src={theme === "light" ? LogoBlack : LogoWhite}
              alt="Storyboarder Logo"
              width="200px"
            />
          </div>
        </header>

        <Board selected={selectedBoardId} triggerSave={saveTrigger} />
      </div>

      {/* Right Drawer */}
      <div
        className={`drawer-container right ${showRightDrawer ? "expanded" : "collapsed"}`}
      >

      <AdminDrawer
        onSave={handleSaveBoard}
        onAddBoard={handleAddBoard}
        onDeleteBoard={handleDeleteBoard} // ✅ still passed
        onToggleTheme={toggleTheme}
        theme={theme}
        isOpen={showRightDrawer}
        onToggle={() => setShowRightDrawer(!showRightDrawer)}
      />



        {showRightDrawer && (
          <AdminDrawer
            onSave={handleSaveBoard}
            onAddBoard={handleAddBoard}
            onDeleteBoard={handleDeleteBoard} // ✅ new
            onToggleTheme={toggleTheme}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}

export default App;
