// src/components/TreeNode.js
import React, { useState } from "react";

const TreeNode = ({ node, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (node.type === "folder") {
      setExpanded(!expanded);
    } else if (node.type === "file") {
      onSelect(node.id); // ✅ send back board id
    }
  };

  return (
    <div className="tree-node">
      <div className="tree-label" onClick={handleClick}>
        {node.type === "folder"
          ? expanded
            ? "📂"
            : "📁"
          : "📄"}{" "}
        {node.name}
      </div>
      {expanded && node.children && (
        <div className="tree-children">
          {node.children.map((child, idx) => (
            <TreeNode key={idx} node={child} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
