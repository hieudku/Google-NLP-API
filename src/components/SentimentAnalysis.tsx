import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import SentimentExplanation from './SentimentExplaination';
import SentimentPieChart from './SentimentVisualization';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import DecryptedText from './Misc/DecryptedText';

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

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ text, onChange }) => {
    const [sentiment, setSentiment] = useState<{ score: number, magnitude: number } | null>(null);
    const [sentences, setSentences] = useState<SentenceSentiment[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [lastCallTime, setLastCallTime] = useState<number | null>(null);
    const throttleDelay = 60000;

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const triggerSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setShowSnackbar(true);
    };

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
            triggerSnackbar('Please enter some text for analysis.');
            return;
        }

        const now = Date.now();
        if (lastCallTime && now - lastCallTime < throttleDelay) {
            triggerSnackbar('Please wait before analyzing again.');
            return;
        }
        setLastCallTime(now);

        setLoading(true);

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
                    text: `${index + 1}. ${sentence.text}`,
                    score: sentimentScore,
                    magnitude: sentence.sentiment.magnitude,
                    category: category,
                };
            });

            setSentiment(response.data.sentiment);
            setSentences(sentimentData);
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                triggerSnackbar(error.response.data || 'Text exceeds limit (1000 characters) or is invalid.');
            } else {
                triggerSnackbar('Unexpected error analyzing text, please try again later.');
            }
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
                    rows={15}
                />
                <div className="textBox-buttons">
                    <button className="dashboard-button" onClick={analyzeText} disabled={loading}>
                        {loading ? 'Analyzing...' : 'Analyze'}
                    </button>
                    <Button
                        className="dashboard-button"
                        onClick={() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLTextAreaElement>)}
                        startIcon={<ClearIcon />}>Clear
                    </Button>
                </div>
                {loading && <Box sx={{ width: '100%' }}><LinearProgress /></Box>}
            </div>

            {sentiment && (
                <div className="results-section" style={{ color: getColour(sentiment.score) }}>
                    <DecryptedText
                    text="Overall Sentiment Analysis Results"
                    animateOn="view"
                    sequential
                    speed={100}
                    />
                    <p>
                    <strong>
                        <DecryptedText
                        text="Sentiment Score:"
                        animateOn="view"
                        sequential
                        speed={100}
                        />
                    </strong>{' '}
                    {sentiment.score.toPrecision(4)}
                    </p>
                    <p>
                    <strong>
                        <DecryptedText
                        text="Sentiment Magnitude:"
                        animateOn="view"
                        sequential
                        speed={100}
                        />
                    </strong>{' '}
                    {sentiment.magnitude.toPrecision(4)}
                    </p>

                    <div className="results-section">
                    <SentimentExplanation />
                    <br />
                    <br />
                    <DecryptedText
                        text="Sentiment Distribution Chart"
                        animateOn="view"
                        sequential
                        speed={100}
                    />
                    <br />
                    <SentimentPieChart data={calculateSentimentDistribution()} />
                    </div>
                </div>
                )}

                {sentences.length > 0 && (
                <div className="results-section">
                    <DecryptedText
                    text="Sentiment Analysis by Sentences"
                    animateOn="view"
                    sequential
                    speed={100}
                    />
                    {sentences.map((sentence, index) => (
                    <div key={index} className="sentence-result" style={{ color: getColour(sentence.score) }}>
                        <p>
                        <DecryptedText
                            text={sentence.text}
                            animateOn="view"
                            sequential
                            speed={100}
                        />
                        </p>
                        <p>
                        <strong>
                            <DecryptedText
                            text="Score:"
                            animateOn="view"
                            sequential
                            speed={100}
                            />
                        </strong>{' '}
                        {sentence.score.toPrecision(4)}
                        </p>
                        <p>
                        <strong>
                            <DecryptedText
                            text="Magnitude:"
                            animateOn="view"
                            sequential
                            speed={100}
                            />
                        </strong>{' '}
                        {sentence.magnitude.toPrecision(4)}
                        </p>
                        <br />
                    </div>
                    ))}
                </div>
                )}


            <Snackbar
                open={showSnackbar}
                autoHideDuration={4000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ zIndex: 9999 }}
            >
                <Alert onClose={() => setShowSnackbar(false)} severity="warning" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SentimentAnalysis;
