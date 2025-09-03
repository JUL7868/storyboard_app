// src/components/Board.js
import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable
} from 'react-beautiful-dnd';
import EditModal from './EditModal';
import Card from './Card';

const initialData = {
  title: "Storyboard",
  description: "This story explores how characters seek and achieve redemption.",
  columns: [
    { id: 'column-1', title: 'Header 1', description: "", cards: [] },
    { id: 'column-2', title: 'Header 2', description: "", cards: [] },
    { id: 'column-3', title: 'Header 3', description: "", cards: [] },
    { id: 'column-4', title: 'Header 4', description: "", cards: [] },
    { id: 'column-5', title: 'Header 5', description: "", cards: [] },
    { id: 'column-6', title: 'Header 6', description: "", cards: [] },
    { id: 'column-7', title: 'Header 7', description: "", cards: [] },
  ]
};

// ✅ Ensure 7 headers and 7 subbers per header
const normalizeBoard = (board) => {
  let headers = board.columns || [];
  for (let i = headers.length; i < 7; i++) {
    headers.push({
      id: `column-${i + 1}`,
      title: `Header ${i + 1}`,
      description: "",
      cards: []
    });
  }
  headers = headers.slice(0, 7);

  headers = headers.map((h) => {
    let cards = h.cards || [];
    for (let j = cards.length; j < 7; j++) {
      cards.push({
        id: `${h.id}-card${j + 1}`,
        title: "",
        description: ""
      });
    }
    cards = cards.slice(0, 7);
    return { ...h, cards };
  });

  return { ...board, columns: headers };
};

const Board = ({ selected, triggerSave }) => {
  const [board, setBoard] = useState(initialData);
  const [editingCard, setEditingCard] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  // ✅ Fetch board from API when selected changes
  useEffect(() => {
    if (selected) {
      fetch(`/storyboard_app/api.php?path=board&id=${selected}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error("API error:", data.error);
            return;
          }
          setBoard({
            ...initialData,
            ...data,
            columns: data.columns || initialData.columns
          });
        })
        .catch(err => console.error("Board fetch failed:", err));
    }
  }, [selected]);

// ✅ Save board to API when Save button is triggered
    useEffect(() => {
      if (triggerSave > 0) {
        const normalized = normalizeBoard(board);

        const payload = {
          id: normalized.id || "",
          title: normalized.title,
          description: normalized.description,
          columns: normalized.columns
        };

        fetch("/storyboard_app/api.php?path=saveBoard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setBoard(prev => ({ ...prev, id: data.id }));
              setSaveMessage("✅ Board saved!");
            } else {
              setSaveMessage("❌ Save failed: " + (data.error || "Unknown error"));
            }
            setTimeout(() => setSaveMessage(""), 3000);
          })
          .catch((err) => {
            console.error("Save error:", err);
            setSaveMessage("❌ Save error, check console");
            setTimeout(() => setSaveMessage(""), 5000);
          });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerSave]);

  // ---------- Save Card ----------
  const handleCardSave = (updatedCard) => {
    const updatedColumns = board.columns.map((col) => {
      if (col.id === updatedCard.id && updatedCard.type === "column") {
        return {
          ...col,
          title: updatedCard.title,
          description: updatedCard.description,
          cards: col.cards
        };
      }

      const updatedCards = col.cards.map((card) =>
        card.id === updatedCard.id ? { ...card, ...updatedCard } : card
      );

      return { ...col, cards: updatedCards };
    });

    setBoard({ ...board, columns: updatedColumns });
    setEditingCard(null);
  };

  // ---------- Promote ----------
  const handlePromote = (columnId) => {
    const column = board.columns.find(c => c.id === columnId);
    if (!column) return;

    const newTitle = column.title;
    const newDescription = column.description || "";

    let newColumns = column.cards.map((detail, idx) => ({
      id: `promoted-col-${idx + 1}`,
      title: detail.title || `Column ${idx + 1}`,
      description: detail.description || "",
      cards: detail.children || []
    }));

    for (let i = newColumns.length; i < 7; i++) {
      newColumns.push({
        id: `promoted-col-${i + 1}`,
        title: `Column ${i + 1}`,
        description: "",
        cards: []
      });
    }

    const newBoard = {
      title: newTitle,
      description: newDescription,
      columns: newColumns
    };

    setBoard(newBoard);
    setEditingCard(null);
  };

  // ---------- Drag & Drop ----------
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColIndex = board.columns.findIndex(col => col.id === source.droppableId);
    const destColIndex = board.columns.findIndex(col => col.id === destination.droppableId);
    const sourceCol = board.columns[sourceColIndex];
    const destCol = board.columns[destColIndex];

    const sourceCards = Array.from(sourceCol.cards);
    const [movedCard] = sourceCards.splice(source.index, 1);

    if (sourceCol === destCol) {
      sourceCards.splice(destination.index, 0, movedCard);
      const newCol = { ...sourceCol, cards: sourceCards };
      const updated = [...board.columns];
      updated[sourceColIndex] = newCol;
      setBoard({ ...board, columns: updated });
    } else {
      const destCards = Array.from(destCol.cards);
      destCards.splice(destination.index, 0, movedCard);
      const updated = [...board.columns];
      updated[sourceColIndex] = { ...sourceCol, cards: sourceCards };
      updated[destColIndex] = { ...destCol, cards: destCards };
      setBoard({ ...board, columns: updated });
    }
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      {/* ✅ Toast message */}
      {saveMessage && (
        <div
          style={{
            backgroundColor: saveMessage.startsWith("✅") ? "#4caf50" : "#f44336",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            marginBottom: "1rem",
            display: "inline-block"
          }}
        >
          {saveMessage}
        </div>
      )}

      {/* Editable Title */}
      <h1
        className="text-3xl font-bold text-center text-gray-800 mb-2 border-b border-gray-300 pb-1"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          setBoard({ ...board, title: e.currentTarget.textContent })
        }
      >
        {board.title}
      </h1>

      {/* Editable Description */}
      <p
        className="text-lg text-center text-gray-500 mb-8 max-w-2xl mx-auto p-2 bg-gray-50 border border-gray-200 rounded-lg"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          setBoard({ ...board, description: e.currentTarget.textContent })
        }
      >
        {board.description}
      </p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: '1rem', minWidth: '1100px' }}>
          {(board.columns || []).map((col) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: '#fefefe',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    width: '150px',
                    padding: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    flexShrink: 0
                  }}
                >
                  <Card
                    card={{
                      id: col.id,
                      type: "column",
                      title: col.title,
                      description: col.description || "",
                    }}
                    onClick={(c) => setEditingCard(c)}
                  />

                  {col.cards.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            marginBottom: '0.5rem'
                          }}
                        >
                          <Card
                            card={{ ...card, type: "detail" }}
                            onClick={(c) => setEditingCard(c)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {editingCard && (
        <EditModal
          card={editingCard}
          onSave={handleCardSave}
          onClose={() => setEditingCard(null)}
          onPromote={handlePromote}
        />
      )}

    </div>
  );
};

export default Board;
