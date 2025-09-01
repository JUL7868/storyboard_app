// src/data/storyboardsData.js
const storyboards = [
  {
    name: "Project A",
    type: "folder",
    children: [
      { name: "Storyboard 1", type: "file", id: "sb1" },
      { name: "Storyboard 2", type: "file", id: "sb2" }
    ]
  },
  {
    name: "Project B",
    type: "folder",
    children: [
      {
        name: "Subfolder",
        type: "folder",
        children: [{ name: "Storyboard X", type: "file", id: "sbx" }]
      }
    ]
  }
];

export default storyboards;
