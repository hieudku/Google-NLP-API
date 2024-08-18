import React, {useState} from "react";
import axios from 'axios';
import './EntityAnalysis.css';
import './Dashboard.css';
import EntityVisualization from "./EntityVisualization";

const EntityAnalysis: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [entities, setEntities] = useState<{ name:string, type: string, salience: number} [] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeEntities = async () => {
        if (!inputText) {
            setError('Please enter text.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                'https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeEntities',
                { params: {text: inputText}}
            );
            setEntities(response.data.entities);
        } catch (error) {
            setError('Error analysing entities, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <h2>Entity Analysis</h2>
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text for entity analysis"
                rows={5}
            />
            <button className="dashboard-button" onClick={analyzeEntities} disabled={loading}>
                {loading ? 'Analyzing...': 'Analyze Entities'}
            </button>

            {error && <p className="error-message">{error}</p>}
            {entities && (
                <div className="results-section">
                <h3>Entities</h3>
                <EntityVisualization data={entities} />
                
                <h3>Entities list</h3>
                <ul>
                        {entities.map((entity, index) => (
                            <li key={index}>
                                <strong>{entity.name}</strong> - {entity.type} (Salience: {entity.salience.toPrecision(6)})
                            </li>
                        ))}
                    </ul>
            </div>
                
            
            )}
        </div>
    );
};

export default EntityAnalysis;