import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';

interface SentencesAnalysisProps {
    text: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EntitySentimentAnalysisSentences: React.FC<SentencesAnalysisProps> = ({text, onChange}) => {
    const [sentences, setSentences] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeSentencesWithSalience = async () => {
        if (!text) {
            setError('Please enter text.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                'https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeSentencesWithSalience',
                { params: { text: text } }
            );
            setSentences(response.data.sentences);
        } catch (error) {
            setError('Error analyzing, please try again.');
        } finally {
            setLoading(false);
        }
    };
    const exportToExcel = () => {
        if (!sentences) return;

        const worksheet = XLSX.utils.json_to_sheet(sentences.map(sentence => ({
            Sentence: sentence.text,
            'Sentiment Score': sentence.sentiment !== undefined ? sentence.sentiment.toFixed(2) : 'N/A',
            Magnitude: sentence.magnitude !== undefined ? sentence.magnitude.toFixed(2) : 'N/A',
            'Aggregated Salience': sentence.aggregatedSalience !== undefined ? sentence.aggregatedSalience.toFixed(2) : 'N/A'
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sentiment Analysis');
        XLSX.writeFile(workbook, 'sentiment_analysis.xlsx');
    };
    return (
        <div className="dashboard">
            <h2>Sentence Sentiment Analysis with Aggregated Salience</h2>
            <textarea
                value={text}
                onChange={onChange}
                placeholder="Enter text for analysis"
                rows={5}
            />
            <button
                className="dashboard-button"
                onClick={analyzeSentencesWithSalience}
                disabled={loading}
            >
                {loading ? 'Analyzing...' : 'Analyze'}
            </button>
            
            {error && <p>{error}</p>}
            {sentences && (
                <div className="results-section">
                    <div className="export-buttons">
                        <Button
                            variant="contained" 
                            color="primary" 
                            onClick={exportToExcel}
                            startIcon={<FaFileExcel />}>Export to Excel
                        </Button>
                    </div>
                    <h3>Analysis Results</h3>
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Sentence</th>
                                <th>Sentiment Score</th>
                                <th>Magnitude</th>
                                <th>Aggregated Salience</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sentences.map((sentence, index) => (
                                <tr key={index}>
                                    <td data-label="Sentence">{sentence.text}</td>
                                    <td data-label="Sentiment">{sentence.sentiment !== undefined ? sentence.sentiment.toFixed(2) : 'N/A'}</td>
                                    <td data-label="Magnitude">{sentence.magnitude !== undefined ? sentence.magnitude.toFixed(2) : 'N/A'}</td>
                                    <td data-label="Salience">{sentence.aggregatedSalience !== undefined ? sentence.aggregatedSalience.toFixed(2) : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EntitySentimentAnalysisSentences;
