// src/components/TreeNode.js
import React, { useState } from "react";

const TreeNode = ({ node, onSelect, activeBoardId, level = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        style={{
          cursor: "pointer",
          paddingLeft: `${level * 16}px`,
          fontWeight: node.id === activeBoardId ? "bold" : "normal",
          color: node.id === activeBoardId ? "#1976d2" : "black",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Toggle arrow if children exist */}
        {node.children && node.children.length > 0 ? (
          <span
            style={{ marginRight: "4px" }}
            onClick={(e) => {
              e.stopPropagation(); // don’t trigger onSelect
              setExpanded(!expanded);
            }}
          >
            {expanded ? "▼" : "▶"}
          </span>
        ) : (
          <span style={{ marginRight: "14px" }} /> // spacer
        )}

        {/* Board title */}
        <span onClick={() => onSelect(node.id)}>{node.title}</span>
      </div>

      {/* Render children if expanded */}
      {expanded &&
        node.children.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            onSelect={onSelect}
            activeBoardId={activeBoardId}
            level={level + 1}
          />
        ))}
    </div>
  );
};

export default TreeNode;
