import React from 'react';
import { useLocation } from 'react-router-dom';
import { useItems } from '../ItemsContext';

const DocPreview = () => {
  const location = useLocation();
  const { items, setItems, addItem } = useItems();

  return (
    <div>
      <h1>Document Preview</h1>
      {Array.isArray(items) ? (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <strong>{item.section}</strong>: {item.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items to display.</p>
      )}
    </div>
  );
};

export default DocPreview;
