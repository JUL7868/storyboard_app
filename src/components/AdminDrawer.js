// src/components/AdminDrawer.js
import React from "react";
import DrawerShell from "./DrawerShell"; // ✅ new import

const AdminDrawer = ({
  onSave,
  onAddBoard,
  onDeleteBoard,
  onToggleTheme,
  theme,
  onToggle,
  isOpen,
}) => {
  return (
    <DrawerShell isOpen={isOpen} onToggle={onToggle} side="right">
      <h3 className="drawer-title">Admin</h3>

      {/* Save Board */}
      <button
        onClick={onSave}
        style={{
          marginTop: "1rem",
          width: "100%",
          padding: "0.5rem",
          backgroundColor: "#4caf50",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        💾 Save Board
      </button>

      {/* Add Storyboard */}
      <button
        onClick={onAddBoard}
        style={{
          marginTop: "1rem",
          width: "100%",
          padding: "0.5rem",
          backgroundColor: "#2196f3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        ➕ Add Storyboard
      </button>

      {/* Delete Storyboard */}
      <button
        onClick={onDeleteBoard}
        style={{
          marginTop: "1rem",
          width: "100%",
          padding: "0.5rem",
          backgroundColor: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        🗑️ Delete Storyboard
      </button>

      {/* Theme Toggle */}
      <button
        onClick={onToggleTheme}
        style={{
          marginTop: "1rem",
          width: "100%",
          padding: "0.5rem",
          backgroundColor: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Switch to {theme === "light" ? "Dark" : "Light"} Theme
      </button>
    </DrawerShell>
  );
};

export default AdminDrawer;
