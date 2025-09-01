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
  title: "Setup",
  description: "This story explores how characters seek and achieve redemption.",
  columns: [
    { id: 'column-1', title: 'Setup', description: "", cards: [] },
    { id: 'column-2', title: 'Conflict', description: "", cards: [] },
    { id: 'column-3', title: 'Rising Action', description: "", cards: [] },
    { id: 'column-4', title: 'Climax', description: "", cards: [] },
    { id: 'column-5', title: 'Falling Action', description: "", cards: [] },
    { id: 'column-6', title: 'Resolution', description: "", cards: [] },
    { id: 'column-7', title: 'Epilogue', description: "", cards: [] },
  ]
};

const Board = ({ selected }) => {
  const [board, setBoard] = useState(initialData);
  const [editingCard, setEditingCard] = useState(null);

  // ✅ Fetch board from API when selected changes
  useEffect(() => {
    if (selected) {
      fetch(`http://localhost/api.php?path=boards&id=${selected}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setBoard(data[0]); // use the API board
          }
        })
        .catch(err => {
          console.error("API error:", err);
        });
    }
  }, [selected]);

  // ---------- Add Card ----------
  const handleAddCard = (colId) => {
    const updatedColumns = board.columns.map(col => {
      if (col.id !== colId) return col;

      if (col.cards.length >= 7) return col;

      const newCard = {
        id: `${col.id}-card${col.cards.length + 1}`,
        type: "detail",
        title: `Card ${col.cards.length + 1}`,
        description: `New detail ${col.cards.length + 1}`,
        children: []
      };

      return { ...col, cards: [...col.cards, newCard] };
    });

    setBoard({ ...board, columns: updatedColumns });
  };

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
      {/* Logo still present — remove if not needed */}
      <img 
        src="studioImaginando.png" 
        alt="Studio Imaginando" 
        style={{ width: '100px', marginBottom: '0.5rem' }} 
      />

      {/* Editable Title */}
      <h3
        style={{
          textAlign: 'center',
          color: '#e0e0e0',
          maxWidth: '400px',
          margin: '0 auto',
          padding: '0.25rem 0',
          border: '1px solid #333',
          borderRadius: '4px'
        }}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          setBoard({ ...board, title: e.currentTarget.textContent })
        }
      >
        {board.title}
      </h3>

      {/* Editable Description */}
      <p
        style={{
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
          padding: '0.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #ddd'
        }}
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
          {board.columns.map((col) => (
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
                  {/* Column Header as Card */}
                  <Card
                    card={{
                      id: col.id,
                      type: "column",
                      title: col.title,
                      description: col.description || "",
                    }}
                    onClick={(c) => setEditingCard(c)}
                  />

                  {/* Detail Cards */}
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

                  {/* +Card Button */}
                  <button
                    onClick={() => handleAddCard(col.id)}
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '0.25rem',
                      border: '1px dashed #aaa',
                      borderRadius: '4px',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    + Card
                  </button>
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

      {/* Reset Board Button */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => {
            setBoard(initialData); // Reset to fallback only
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e53935',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Reset Board
        </button>
      </div>
    </div>
  );
};

export default Board;
