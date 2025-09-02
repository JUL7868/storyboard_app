import React, { useState, useEffect } from 'react';

const EditModal = ({ card, onSave, onClose, onPromote }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);

  // Keep modal state in sync if another card is opened
  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description);
  }, [card]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 999
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          width: '400px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
        }}
      >
        <h3>Edit Card</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={4}
          style={{ width: '100%', padding: '0.5rem' }}
        />

        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button onClick={onClose} style={{ marginRight: '0.5rem' }}>
            Cancel
          </button>

          {card.type === "column" && (
            <button
              onClick={() => onPromote(card.id)}
              style={{
                backgroundColor: "#ff9800",
                color: "#fff",
                padding: "0.5rem 1rem",
                marginRight: "0.5rem",
              }}
            >
              ⭐ Promote
            </button>
          )}

          <button
            onClick={() => {
              // ✅ only update React state
              onSave({ ...card, title, description });
              onClose(); // auto-close after save
            }}
            style={{
              backgroundColor: "#007acc",
              color: "#fff",
              padding: "0.5rem 1rem",
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
