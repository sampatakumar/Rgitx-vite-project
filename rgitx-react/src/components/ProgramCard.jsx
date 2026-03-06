import React, { useState } from 'react';

const ProgramCard = ({ number, title, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="program">
            <h2>PROGRAM {number}</h2>
            <h3>{title}</h3>

            <textarea
                readOnly
                value={code}
                id={`code${number}`}
            />
            <br />

            <button
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
            >
                {copied ? 'Copied ✓' : 'Copy'}
            </button>
            <hr />
        </div>
    );
};

export default ProgramCard;
