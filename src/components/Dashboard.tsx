import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; 
import SentimentExplanation from './SentimentExplaination';

const Dashboard: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [inputUrl, setInputUrl] = useState('');
    const [sentiment, setSentiment] = useState<{ score: number, magnitude: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeText = async () => {
        if (!inputText) {
            setError('Please enter some text for analysis.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                'https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeText', 
                { params: { text: inputText } }
            );
            setSentiment(response.data.sentiment);
        } catch (error) {
            setError('Error analyzing sentiment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const analyzeUrl = async () => {
        
        setError('URL analysis is not implemented yet.');
    };
    
    const getColour = (score: number) => {
        if (score > 0.2) return 'green';
        if (score < -0.2) return 'red';
        return 'gray';
    }

    return (
        <div className="dashboard">
            <h1>Sentiment Analysis Dashboard</h1>

            <div className="input-section">
                <p><strong>Insert text here to analyze.</strong> **Note: Authenticated users will be able to save results, access to entity analysis and URL analysis (soon). </p>
                <br />
                <p>Note: Long text will take a minute or two to analyze, please be patient and try again if it doesn't run the first time.</p>
                <br />
                <p>Start with a news article below...or something else.</p>
                
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text for sentiment analysis"
                    rows={5}
                />
                <button onClick={analyzeText} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze Text'}
                </button>
            </div>

            <div className="input-section">
                <p>Analyze URL</p>
                <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Enter URL to analyze"
                />
                <button onClick={analyzeUrl} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze URL'}
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {sentiment && (
                <div className="results-section" style={{ color: getColour(sentiment.score)}}>
                    <h3>Sentiment Analysis Results</h3>
                    <p><strong>Sentiment Score:</strong> {sentiment.score.toPrecision(4)}</p>
                    <p><strong>Sentiment Magnitude:</strong> {sentiment.magnitude.toPrecision(4)}</p>
                </div>
            )}
            <SentimentExplanation />

        </div>
    );
};

export default Dashboard;