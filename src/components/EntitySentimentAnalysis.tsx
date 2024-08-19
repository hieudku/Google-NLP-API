import React, {useState} from 'react';
import axios from 'axios';
import './Dashboard.css';

const EntitySentimentAnalysis: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [entities, setEntities] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeEntitySentiment = async () => {
        if (!inputText) {
            setError('Please enter text.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeEntitySentiment',
            {params: {text: inputText} }
            );
            setEntities(response.data.entities);
        }
        catch (error) {
            setError('Error analyzing, please try again.');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <h2>Entity Sentiment Analysis</h2>
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text for entity sentiment analysis"
                rows={5}
            />
            <button className="dashboard-button" onClick={analyzeEntitySentiment} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze'}
            </button>

            {error && <p>{error}</p>}
      {entities && (
        <div className="results-section">
          <h3>Entities and Sentiments</h3>
          <ul>
            {entities.map((entity, index) => (
              <li key={index}>
                <strong>{entity.name}</strong> ({entity.type}) - Sentiment Score: {entity.sentiment.score}, Magnitude: {entity.sentiment.magnitude}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EntitySentimentAnalysis;