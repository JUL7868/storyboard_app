import React from 'react';

const Card = ({ card, onClick }) => {
  return (
    <div
      style={{
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: '#ffffff',
        border: '1px solid #ccc',
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onDoubleClick={() => onClick && onClick(card)} // open modal on double-click
    >
      <h4 style={{ margin: 0 }}>{card.title}</h4>
      {card.description && (
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          {card.description}
        </p>
      )}
    </div>
  );
};

export default Card;
