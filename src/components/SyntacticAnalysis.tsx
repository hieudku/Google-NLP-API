import React, { useState } from 'react';
import axios from 'axios';

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
                { params: { text: inputText }}
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
    return (
        <div className="dashboard">
            <h1>Syntactic Analysis</h1>
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
                <div className="results-section">
                    <h3>Syntactic Analysis Results</h3>
                    <ul>
                        {tokens.map((token, index) => (
                            <li key={index}>
                                <br />
                                <strong>Text:</strong> {token.text} <br />
                                <strong>Part of Speech:</strong> {token.partOfSpeech} <br />
                                <strong>Dependency:</strong> {token.dependencyEdge}
                                <br />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SyntacticAnalysis;