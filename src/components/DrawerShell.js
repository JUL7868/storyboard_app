// src/components/DrawerShell.js
import React from "react";

const DrawerShell = ({ isOpen, onToggle, side = "left", children }) => {
  return (
    <div
      style={{
        width: isOpen ? "250px" : "40px",
        background: "#fff",
        borderRight: side === "left" ? "1px solid #ddd" : "none",
        borderLeft: side === "right" ? "1px solid #ddd" : "none",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "width 0.3s ease",
      }}
    >
        <div
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: side === "right" ? "flex-start" : "flex-start", // always align start
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
            marginLeft: side === "right" ? "auto" : "0", // ✅ pin to far right if drawer is right side
            }}
        >
            ☰
        </button>
        </div>

      {/* Scrollable content area */}
      {isOpen && (
        <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default DrawerShell;
