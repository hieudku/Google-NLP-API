import React from 'react';
import './Dashboard.css'
const SentimentExplanation: React.FC = () => {
    return (
        <div className="sentiment-info">
            <h3>Understanding the Results:</h3>
            <br />
            <ul>
                <li><strong>Sentiment Score:</strong> Ranges from -1.0 (negative-red) to 1.0 (positive-green). A score of 0 indicates neutral-grey sentiment.</li>
                <li><strong>Sentiment Magnitude:</strong> The strength of the sentiment. 
                Higher magnitude means stronger emotional content in the text. Scaling: Low: 0.1-2, Medium: 2-5, High: 5 and above.</li>
            </ul>
        </div>
    );
};

export default SentimentExplanation;