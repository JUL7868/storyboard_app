// src/components/Drawer.js
import React from "react";
import TreeNode from "./TreeNode";
import storyboards from "../data/storyboardsData"; // we’ll define this next

const Drawer = ({ onSelect }) => {
  return (
    <div className="drawer">
      <h3 className="drawer-title">Storyboards</h3>
      <div className="drawer-tree">
        {storyboards.map((node, idx) => (
          <TreeNode key={idx} node={node} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};

export default Drawer;
