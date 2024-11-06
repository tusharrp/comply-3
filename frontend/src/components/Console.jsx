import React from 'react';
import './Console.css';

const Console = ({ items = [], onItemSelect }) => {
    return (
        <div className="console">
            <div className="console-top">
                <h3>Index</h3>
                <div>
                    {items.map((item, index) => (
                        <div key={index} onClick={() => onItemSelect(index)} style={{ cursor: 'pointer' }}>
                            <strong>{item.title}</strong>
                        </div>
                    ))}
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

