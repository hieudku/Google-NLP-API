import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';

interface SyntacticAnalysisProps {
    text: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SyntacticAnalysis: React.FC<SyntacticAnalysisProps> = ({text, onChange}) => {
    const [tokens, setTokens] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeSyntax = async () => {
        if (!text) {
            setError('Please enter some text for analysis.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                'https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeSyntax',
                { params:{text: text}}
            );
            setTokens(response.data.tokens);
        } 
        catch (error) {
            setError('Error while analyzing syntax. Please try again.');
        } 
        finally {
            setLoading(false);
        }
    };
    // Set colours based on types of word
    const getColorForPartOfSpeech = (partOfSpeech: string) => {
        switch (partOfSpeech) {
            case 'NOUN': return '#4CAF50'; // Green
            case 'VERB': return '#2196F3'; // Blue
            case 'ADJ': return '#FFEB3B'; // Yellow
            case 'ADP': return '#FF9800'; // Orange
            case 'PRON': return '#9C27B0'; // Purple
            case 'CONJ': return '#E91E63'; // Pink
            case 'PUNCT': return '#607D8B'; // Gray
            case 'NUM': return '#00BCD4'; // Cyan
            default: return '#E0E0E0'; // Black - other
        }
    };
    // Legend
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
            {error && <p className="error-message">{error}</p>}

            {tokens && (
                <div className="syntactic-analysis-results">
                    <div className="export-buttons">
                        <Button
                            variant="contained" 
                            color="primary" 
                            onClick={exportToExcel}
                            startIcon={<FaFileExcel />}>Export to Excel
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
