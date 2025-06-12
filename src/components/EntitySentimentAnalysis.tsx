import React, {useState} from 'react';
import axios from 'axios';
import './Dashboard.css';
import EntitySentimentTable from './EntitySentimentTable';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface EntitySentimentAnalysisProps {
  text: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EntitySentimentAnalysis: React.FC<EntitySentimentAnalysisProps> = ({text, onChange}) => {
    const [entities, setEntities] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    const analyzeEntitySentiment = async () => {
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
        setError(null);

        try {
            const response = await axios.get('https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeEntitySentiment',
            {params: {text: text} }
            );
            setEntities(response.data.entities);
            console.log('Entities:', response.data.entities);
        }
        catch (error: any) {
          if (error.response && error.response.status === 400) {
              setSnackbarMessage(error.response.data || 'Text exceeds limit (1000 characters) or is invalid.');
          } else {
              setSnackbarMessage('Unexpected error analyzing entities, please try again later.');
          }
          setShowSnackbar(true);
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

export default EntitySentimentAnalysis;
