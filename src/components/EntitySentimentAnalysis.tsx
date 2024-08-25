import React, {useState} from 'react';
import axios from 'axios';
import './Dashboard.css';
import EntitySentimentTable from './EntitySentimentTable';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface EntitySentimentAnalysisProps {
  text: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EntitySentimentAnalysis: React.FC<EntitySentimentAnalysisProps> = ({text, onChange}) => {
    const [entities, setEntities] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeEntitySentiment = async () => {
        if (!text) {
            setError('Please enter text.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeEntitySentiment',
            {params: {text: text} }
            );
            setEntities(response.data.entities);
            console.log('Entities:', entities);
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
                value={text}
                onChange={onChange}
                placeholder="Enter text for entity sentiment analysis"
                rows={15}
            />

            <div className="textBox-buttons">
              <button className="dashboard-button" onClick={analyzeEntitySentiment} disabled={loading}>
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
            {error && <p>{error}</p>}
      {entities && (
        <div className="results-section">
          <EntitySentimentTable data={entities} />
          <h3>Entities and Sentiments</h3>
          <ul>
            {entities.map((entity, index) => (
              <li key={index}>
              <strong>{entity.name}</strong> ({entity.type}) - Sentiment Score: 
              {entity.sentiment ? entity.sentiment.score.toFixed(2) : 'N/A'}, 
              Magnitude: 
              {entity.sentiment ? entity.sentiment.magnitude.toFixed(2) : 'N/A'}
          </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EntitySentimentAnalysis;