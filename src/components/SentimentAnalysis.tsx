import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import SentimentExplanation from './SentimentExplaination';
import SentimentPieChart from './SentimentVisualization';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';

interface SentenceSentiment {
    text: string;
    score: number;
    magnitude: number;
    category: 'positive' | 'neutral' | 'negative';
}

interface SentimentAnalysisProps {
    text: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({text, onChange}) => {
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
        if (!text) {
            setError('Please enter some text for analysis.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                'https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeText', 
                { params: { text: text } }
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
                    value={text}
                    onChange={onChange}
                    placeholder="Enter text for sentiment analysis"
                    rows={10}
                />
                <div className="textBox-buttons">
                    <button className="dashboard-button" onClick={analyzeText} disabled={loading}>
                        {loading ? 'Analyzing...' : 'Analyze'}
                    </button>
                    <Button 
                        className="dashboard-button"
                        startIcon={<ClearIcon />}>Clear
                    </Button>
                </div>
            </div>
            {error && <p className="error-message">{error}</p>}
            {sentiment && (
                <div className="results-section" style={{ color: getColour(sentiment.score) }}>
                    <h3>Overall Sentiment Analysis Results</h3>
                    <p><strong>Sentiment Score:</strong> {sentiment.score.toPrecision(4)}</p>
                    <p><strong>Sentiment Magnitude:</strong> {sentiment.magnitude.toPrecision(4)}</p>
                    <div className="results-section">
                    <SentimentExplanation />
                <h3>Sentiment Distribution Chart</h3><br />
                <SentimentPieChart data={calculateSentimentDistribution()}/>
                </div>
                </div>
            )}
                
            {sentences.length > 0 && (
                <div className="results-section">
                    <h3>Sentiment Analysis by Sentences</h3>
                    {sentences.map((sentence, index) => (
                        <div key={index} className="sentence-result" style={{ color: getColour(sentence.score) }}>
                            <p>{sentence.text}</p>
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
