import React from 'react';
import './Dashboard.css'
const SentimentExplanation: React.FC = () => {
    return (
        <div className="sentiment-info">
            <h3>Understanding the Results:</h3>
            <br />
            <ul>
                <li><strong>Sentiment Score:</strong> Ranges from -1.0 (very negative) to 1.0 (very positive). A score of 0 indicates neutral sentiment.</li>
                <li><strong>Sentiment Magnitude:</strong> Represents the strength of the sentiment. Higher magnitude means stronger emotional content in the text.</li>
            </ul>
        </div>
    );
};

export default SentimentExplanation;