// src/components/AdminDrawer.js
import React from "react";

const AdminDrawer = ({ onSave }) => {
  return (
    <div className="admin-drawer">
      <h3 className="drawer-title">Admin</h3>
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
    </div>
  );
};

export default AdminDrawer;
