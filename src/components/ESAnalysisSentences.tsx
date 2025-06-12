import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface SentencesAnalysisProps {
    text: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EntitySentimentAnalysisSentences: React.FC<SentencesAnalysisProps> = ({text, onChange}) => {
    const [sentences, setSentences] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [lastAnalyzeTime, setLastAnalyzeTime] = useState<number | null>(null);
    const throttleDelay = 60000;

    const handleThrottle = (): boolean => {
        const now = Date.now();
        if (lastAnalyzeTime && now - lastAnalyzeTime < throttleDelay) {
            setSnackbarMessage('Please wait before analyzing again.');
            setShowSnackbar(true);
            return true;
        }
        setLastAnalyzeTime(now);
        return false;
    };

    const analyzeSentencesWithSalience = async () => {
        if (!text) {
            setSnackbarMessage('Please enter text.');
            setShowSnackbar(true);
            return;
        }

        if (text.length > 1000) {
            setSnackbarMessage('Text exceeds limit (1000 characters).');
            setShowSnackbar(true);
            return;
        }

        if (handleThrottle()) return;

        setLoading(true);

        try {
            const response = await axios.get(
                'https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeSentencesWithSalience',
                { params: { text: text } }
            );
            setSentences(response.data.sentences);
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                setSnackbarMessage(error.response.data || 'Text exceeds limit (1000 characters) or is invalid.');
            } else {
                setSnackbarMessage('Unexpected error analyzing entities, please try again later.');
            }
            setShowSnackbar(true);
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
        XLSX.writeFile(workbook, 'sentence_analysis.xlsx');
    };

    const exportToCSV = () => {
        if (!sentences) return;

        const worksheet = XLSX.utils.json_to_sheet(sentences.map(sentence => ({
            Sentence: sentence.text,
            'Sentiment Score': sentence.sentiment !== undefined ? sentence.sentiment.toFixed(2) : 'N/A',
            Magnitude: sentence.magnitude !== undefined ? sentence.magnitude.toFixed(2) : 'N/A',
            'Aggregated Salience': sentence.aggregatedSalience !== undefined ? sentence.aggregatedSalience.toFixed(2) : 'N/A'
        })));

        const csv = XLSX.utils.sheet_to_csv(worksheet);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'sentence_analysis.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard">
            <h2>Sentence Sentiment Analysis with Aggregated Salience</h2>
            <textarea
                value={text}
                onChange={onChange}
                placeholder="Enter text for analysis"
                rows={15}
            />
            <div className="textBox-buttons">
                <button
                    className="dashboard-button"
                    onClick={analyzeSentencesWithSalience}
                    disabled={loading}
                >
                    {loading ? 'Analyzing...' : 'Analyze'}
                </button>
                <Button 
                  className="dashboard-button"
                  onClick={() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLTextAreaElement>)}
                  startIcon={<ClearIcon />}>Clear
              </Button>
            </div>

            {loading && <Box sx={{ width: '100%' }}>
              <LinearProgress />
              </Box>}

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

            {sentences && (
                <div className="results-section">
                    <div className="export-buttons">
                        <Button
                            variant="contained" 
                            color="primary" 
                            onClick={exportToExcel}
                            startIcon={<FaFileExcel />}>Export to XLSX
                        </Button>
                        <Button
                            variant="contained" 
                            color="primary" 
                            onClick={exportToCSV}
                            startIcon={<TextSnippetIcon />}>Export to CSV
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
