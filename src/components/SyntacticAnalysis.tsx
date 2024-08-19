import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const SyntacticAnalysis: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [tokens, setTokens] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeSyntax = async () => {
        if (!inputText) {
            setError('Please enter some text for analysis.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                'https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeSyntax',
                { params:{text: inputText}}
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
            default: return '#000'; // Black - other
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
    ];
    return (
        <div className="dashboard">
            <h2>Syntactic Analysis</h2>
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text for syntactic analysis"
                rows={5}
            />
            <button className="dashboard-button" onClick={analyzeSyntax} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Syntax'}
            </button>

            {error && <p className="error-message">{error}</p>}

            {tokens && (
                <div className="syntactic-analysis-results">
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
