import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface SyntacticAnalysisProps {
    text: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SyntacticAnalysis: React.FC<SyntacticAnalysisProps> = ({text, onChange}) => {
    const [tokens, setTokens] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [lastCallTime, setLastCallTime] = useState<number | null>(null);
    const throttleDelay = 60000;

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const analyzeSyntax = async () => {
        if (!text) {
            setSnackbarMessage('Please enter some text for analysis.');
            setShowSnackbar(true);
            return;
        }

        const now = Date.now();
        if (lastCallTime && now - lastCallTime < throttleDelay) {
            setSnackbarMessage('Please wait before analyzing again.');
            setShowSnackbar(true);
            return;
        }
        setLastCallTime(now);

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                'https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeSyntax',
                { params:{text: text}}
            );
            setTokens(response.data.tokens);
        } 
        catch (error: any) {
          if (error.response && error.response.status === 400) {
              setSnackbarMessage(error.response.data || 'Text exceeds limit (1000 characters) or is invalid.');
          } else {
              setSnackbarMessage('Unexpected error analyzing syntax, please try again later.');
          }
          setShowSnackbar(true);
        } 
        finally {
            setLoading(false);
        }
    };

    const getColorForPartOfSpeech = (partOfSpeech: string) => {
        switch (partOfSpeech) {
            case 'NOUN': return '#4CAF50';
            case 'VERB': return '#2196F3';
            case 'ADJ': return '#FFEB3B';
            case 'ADP': return '#FF9800';
            case 'PRON': return '#9C27B0';
            case 'CONJ': return '#E91E63';
            case 'PUNCT': return '#607D8B';
            case 'NUM': return '#00BCD4';
            default: return '#E0E0E0';
        }
    };

    const legendItems = [
        { label: 'Noun', color: '#4CAF50' },
        { label: 'Verb', color: '#2196F3' },
        { label: 'Adjective', color: '#FFEB3B' },
        { label: 'Adposition', color: '#FF9800' },
        { label: 'Pronoun', color: '#9C27B0' },
        { label: 'Conjunction', color: '#E91E63' },
        { label: 'Punctuation', color: '#607D8B' },
        { label: 'Numeral', color: '#00BCD4' },
        { label: 'Other', color: '#E0E0E0'},
    ];

    const dependencyExplanations = {
        NSUBJ: 'Nominal subject - subject of a verb.',
        ADVMOD: 'Adverbial modifier - word or phrase that modifies a verb, adjective, or adverb.',
        AMOD: 'Adjectival modifier - adjective that modifies a noun.',
        ROOT: 'Root of the sentence - usually the main verb.',
        CC: 'Coordinating conjunction - joins elements of equal syntactic importance.',
        CONJ: 'Conjunct - elements connected by a coordinating conjunction.',
        P: 'Punctuation - marks the end of a sentence or separates elements.',
        PREP: 'Preposition - links nouns, pronouns, or phrases to other words in a sentence.',
        POBJ: 'Object of a preposition.',
        APPOS: 'Appositional modifier - noun that follows and renames another noun.',
        NUMBER: 'Numeric modifier - number that modifies a noun.',
        POSS: 'Possession modifier - indicates ownership.',
        NN: 'Noun compound modifier - noun used to modify another noun.'
    };

    const exportToExcel = () => {
        if (!tokens) return;

        const worksheet = XLSX.utils.json_to_sheet(tokens.map(token => ({
            'Token': token.text !== undefined ? token.text : 'N/A',
            'PartOfSpeech': token.partOfSpeech !== undefined ? token.partOfSpeech : 'N/A',
            'Dependency': token.dependencyEdge !== undefined ? token.dependencyEdge : 'N/A'
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Syntax Analysis');
        XLSX.writeFile(workbook, 'syntactic_analysis.xlsx');
    };

    const exportToCSV = () => {
        if (!tokens) return;

        const worksheet = XLSX.utils.json_to_sheet(tokens.map(token => ({
            'Token': token.text !== undefined ? token.text : 'N/A',
            'PartOfSpeech': token.partOfSpeech !== undefined ? token.partOfSpeech : 'N/A',
            'Dependency': token.dependencyEdge !== undefined ? JSON.stringify(token.dependencyEdge) : 'N/A'
        })));

        const csv = XLSX.utils.sheet_to_csv(worksheet);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'syntactic_analysis.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard">
            <h2>Syntactic Analysis</h2>
            <textarea
                value={text}
                onChange={onChange}
                placeholder="Enter text for syntactic analysis"
                rows={15}
            />
            <div className="textBox-buttons">
                <button className="dashboard-button" onClick={analyzeSyntax} disabled={loading}>
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

            {tokens && (
                <div className="syntactic-analysis-results">
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
                    <p><strong>Part of Speech:</strong></p>
                    <div className="legend">
                        {legendItems.map((item, index) => (
                            <div key={index} className="legend-item">
                                <span
                                    className="legend-color"
                                    style={{ backgroundColor: item.color }}
                                ></span>
                                {item.label}
                            </div>
                        ))}
                    </div>

                    <p>
                        Click/hover over each word to reveal additional details about its role in the sentence.
                    </p><br />
                    <div className="dependency-explanation">
                        <h4>Quick Explanation of Dependency Types</h4>
                        <ul>
                            {Object.entries(dependencyExplanations).map(([key, value]) => (
                                <li key={key}>
                                    <strong>{key}:</strong> {value}
                                </li>
                            ))}
                        </ul>
                    </div><br />
                    <div className="syntactic-tokens">
                        {tokens.map((token, index) => (
                            <span
                                key={index}
                                className="token"
                                style={{ backgroundColor: getColorForPartOfSpeech(token.partOfSpeech) }}
                                data-tooltip={`Part of Speech: ${token.partOfSpeech}, Dependency: ${token.dependencyEdge}`}
                            >
                                {token.text}{' '}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SyntacticAnalysis;
