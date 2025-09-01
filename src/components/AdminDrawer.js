// src/components/AdminDrawer.js
import React from "react";

const AdminDrawer = ({ onSave, onToggleTheme, theme }) => {
  return (
    <div className="admin-drawer">
      <h3 className="drawer-title">Admin</h3>

      {/* Save Board Button */}
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
        Save Board
      </button>

      {/* Theme Toggle Button */}
      <button
        onClick={() => {
          console.log("Button clicked! theme before:", theme);
          onToggleTheme();
        }}
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
  );
};

export default AdminDrawer;
