// src/components/TreeNode.js
import React, { useState } from "react";

const TreeNode = ({ node, onSelect, level = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (node.children && node.children.length > 0) {
      setExpanded(!expanded); // expand/collapse
    } else {
      onSelect(node.id); // select a board
    }
  };

  return (
    <div style={{ marginLeft: level * 15 }}> {/* indent based on depth */}
      <div
        className="tree-label"
        onClick={handleClick}
        style={{
          cursor: "pointer",
          fontSize: `${14 - level}px`, // smaller font at deeper levels
        }}
      >
        {node.children && node.children.length > 0
          ? expanded
            ? "📂 "
            : "📁 "
          : "📄 "}
        {node.title}
      </div>

      {expanded &&
        node.children &&
        node.children.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            onSelect={onSelect}
            level={level + 1}
          />
        ))}
    </div>
  );
};

export default TreeNode;
