// src/components/Drawer.js
import React, { useEffect, useState } from "react";
import TreeNode from "./TreeNode";

const Drawer = ({ onSelect }) => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetch("http://localhost/api.php?path=boards")
      .then((res) => res.json())
      .then((data) => setBoards(data))
      .catch((err) => console.error("Drawer API error:", err));
  }, []);

  return (
    <div className="drawer">
      <h3 className="drawer-title">Storyboards</h3>
      <div className="drawer-tree">
        {boards.map((board) => (
          <TreeNode
            key={board.id}
            node={{
              type: "file",
              id: board.id,
              name: board.title, // ✅ pull from DB
            }}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default Drawer;
