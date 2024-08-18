import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import SentimentExplanation from './SentimentExplaination';
import SentimentPieChart from './SentimentVisualization';

interface SentenceSentiment {
    text: string;
    score: number;
    magnitude: number;
    category: 'positive' | 'neutral' | 'negative';
}

const SentimentAnalysis: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [inputUrl, setInputUrl] = useState('');
    const [sentiment, setSentiment] = useState<{ score: number, magnitude: number } | null>(null);
    const [sentences, setSentences] = useState<SentenceSentiment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculateSentimentDistribution = () => {
        let positive = 0;
        let neutral = 0;
        let negative = 0;
    
        sentences.forEach(sentence => {
            if (sentence.score > 0.2) {
                positive += 1;
            } else if (sentence.score < -0.2) {
                negative += 1;
            } else {
                neutral += 1;
            }
        });
    
        return { positive, neutral, negative };
    };

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

            const sentimentData = response.data.sentences.map((sentence: any, index: number) => {
                const sentimentScore = sentence.sentiment.score;
                let category: 'positive' | 'neutral' | 'negative' = 'neutral';

                if (sentimentScore > 0.2) {
                    category = 'positive';
                } else if (sentimentScore < -0.2) {
                    category = 'negative';
                }

                return {
                    text: `${index + 1}. ${sentence.text}`, // Ensure text.content is used
                    score: sentimentScore,
                    magnitude: sentence.sentiment.magnitude,
                    category: category,
                };
            });

            setSentiment(response.data.sentiment);
            setSentences(sentimentData);
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
    };

    return (
        <div className="dashboard">
            <h2>Sentiment Analysis</h2>
            <div className="input-section">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text for sentiment analysis"
                    rows={5}
                />
                <button className="dashboard-button" onClick={analyzeText} disabled={loading}>
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
                <button className="dashboard-button" onClick={analyzeUrl} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze URL'}
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}
            <SentimentExplanation />
            {sentiment && (
                <div className="results-section" style={{ color: getColour(sentiment.score) }}>
                    <h3>Overall Sentiment Analysis Results</h3>
                    <p><strong>Sentiment Score:</strong> {sentiment.score.toPrecision(4)}</p>
                    <p><strong>Sentiment Magnitude:</strong> {sentiment.magnitude.toPrecision(4)}</p>
                </div>
            )}
                <div className="results-section">
                <h3>Sentiment Distribution Chart</h3><br />
                
                <SentimentPieChart data={calculateSentimentDistribution()}/>
                </div>
            {sentences.length > 0 && (
                <div className="results-section">
                    <h3>Sentiment Analysis by Sentences</h3>
                    {sentences.map((sentence, index) => (
                        <div key={index} className="sentence-result" style={{ color: getColour(sentence.score) }}>
                            <p>{index}. {sentence.text}</p>
                            <p><strong>Score:</strong> {sentence.score.toPrecision(4)}</p>
                            <p><strong>Magnitude:</strong> {sentence.magnitude.toPrecision(4)}</p>
                            <br />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SentimentAnalysis;
