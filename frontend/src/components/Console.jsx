import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Console.css';
import { useItems } from '../ItemsContext';

const Console = ({ onItemSelect }) => {
    const navigate = useNavigate();

    const items = useItems();

    return (
        <div className="console">
            <div className="console-top">
                <h3>Index</h3>
                <button onClick={() => navigate('/docpreview')}>Go to DocPreview</button>
                <div>
                    {Array.isArray(items) ? (
                        items.map((item, index) => (
                            <div key={index} style={{ cursor: 'pointer' }}>
                                <strong>{item.section}</strong>
                            </div>
                        ))
                    ) : (
                        <p>No items available.</p>
                    )}
                </div>
            </div>
            <div className="console-bottom">
                <h3>Bottom Section</h3>
                <p>Thinking of adding a chatbot/helper in this section</p>
            </div>
        </div>
    );
};

export default Console;
