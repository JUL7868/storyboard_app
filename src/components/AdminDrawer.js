// src/components/AdminDrawer.js
import React from "react";

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
    <div
      style={{
        width: isOpen ? "250px" : "40px", // ✅ toggle width consistent with Drawer.js
        background: "#fff",
        borderLeft: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "width 0.3s ease",
      }}
    >
      {/* Drawer Header with Hamburger */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.5rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        <button
          onClick={onToggle}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "1.25rem",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>

      {/* Drawer Content */}
      {isOpen && (
        <div
          className="drawer-content"
          style={{ padding: "1rem", flex: 1, overflowY: "auto" }}>
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
        </div>
      )}
    </div>
  );
};

export default AdminDrawer;
