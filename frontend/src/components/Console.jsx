import React from 'react';
import './Console.css';

const Console = () => {
    return (
        <div className="console">
            <div className="console-top">
                {/* Top section content */}
                <h3>Top Section</h3>
                <p>Index Will go here should span half the console</p>
            </div>
            <div className="console-bottom">
                {/* Bottom section content */}
                <h3>Bottom Section</h3>
                <p>Thinking of adding a chatbot/helper in this section</p>
            </div>
        </div>
    );
};

export default Console;
