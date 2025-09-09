// src/components/Drawer.js
import React, { useEffect, useState } from "react";
import TreeNode from "./TreeNode";
import DrawerShell from "./DrawerShell"; // ✅ new import

const Drawer = ({ onSelect, activeBoardId, refresh, onToggle, isOpen }) => {
  const [boards, setBoards] = useState([]);
  const [tree, setTree] = useState([]);

  // Fetch boards
  useEffect(() => {
    fetch("/storyboard_app/api.php?path=boards")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("API error:", data.error);
          return;
        }
        setBoards(data);
      })
      .catch((err) => console.error("Failed to fetch boards:", err));
  }, [refresh]);

  // Build tree
  useEffect(() => {
    const buildTree = (items, parentId = null) => {
      return items
        .filter((item) => item.parent_id === parentId)
        .map((item) => ({
          ...item,
          children: buildTree(items, item.id),
        }));
    };
    setTree(buildTree(boards));
  }, [boards]);

  return (
    <DrawerShell isOpen={isOpen} onToggle={onToggle} side="left">
      <h4 style={{ margin: "0 0 1rem 0" }}>Storyboards</h4>

      {tree.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onSelect={onSelect}
          activeBoardId={activeBoardId}
        />
      ))}
    </DrawerShell>
  );
};

export default Drawer;
