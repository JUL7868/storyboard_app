// src/components/Drawer.js
import React, { useEffect, useState } from "react";
import TreeNode from "./TreeNode";

// Utility: build nested tree from flat boards
function buildTree(boards, parentId = null) {
  return boards
    .filter(b => b.parent_id === parentId)
    .map(b => ({
      ...b,
      children: buildTree(boards, b.id) // recurse
    }));
}

const Drawer = ({ onSelect }) => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetch("/storyboard_app/api.php?path=boards")
      .then((res) => res.json())
      .then((data) => {
        const tree = buildTree(data); // ✅ convert flat list into nested tree
        setBoards(tree);
      })
      .catch((err) => console.error("Drawer API error:", err));
  }, []);

  return (
    <div className="drawer">
      <h3 className="drawer-title">Storyboards</h3>
      <div className="drawer-tree" style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
        {boards.map((board) => (
          <TreeNode
            key={board.id}
            node={board}
            onSelect={onSelect}
            level={0}   // start indent at root
          />
        ))}
      </div>
    </div>
  );
};

export default Drawer;
