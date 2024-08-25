import React, {useState} from "react";
import axios from 'axios';
import './EntityAnalysis.css';
import './Dashboard.css';
import EntityVisualization from "./EntityVisualization";
import ClearIcon from '@mui/icons-material/Clear';
import * as XLSX from 'xlsx';
import Button from '@mui/material/Button';
import { FaFileExcel } from 'react-icons/fa';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface EntityAnalysisProps {
    text: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EntityAnalysis: React.FC<EntityAnalysisProps> = ({text, onChange}) => {
    const [entities, setEntities] = useState<{ name:string, type: string, salience: number} [] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeEntities = async () => {
        if (!text) {
            setError('Please enter text.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                'https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeEntities',
                { params: {text: text}}
            );
            setEntities(response.data.entities);
        } catch (error) {
            setError('Error analysing entities, please try again.');
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        if (!text || !entities) return;

        const worksheet = XLSX.utils.json_to_sheet(entities.map(entity => ({
            'Entity': entity.name !== undefined ? entity.name : 'N/A',
            'Type': entity.type !== undefined ? entity.type : 'N/A',
            'Salience': entity.salience !== undefined ? entity.salience : 'N/A'
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Entities Analysis');
        XLSX.writeFile(workbook, 'entity_analysis.xlsx');
    };
    return (
        <div className="dashboard">
            <h2>Entity Analysis</h2>
            <textarea
                value={text}
                onChange={onChange}
                placeholder="Enter text for entity analysis"
                rows={15}
            />
            <div className="textBox-buttons">
                <button className="dashboard-button" onClick={analyzeEntities} disabled={loading}>
                    {loading ? 'Analyzing...': 'Analyze'}
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

            {error && <p className="error-message">{error}</p>}
            {entities && (
                
                <div className="results-section">
                    <div className="export-buttons">
                        <Button
                            variant="contained" 
                            color="primary" 
                            onClick={exportToExcel}
                            startIcon={<FaFileExcel />}>Export to Excel
                        </Button>
                    </div>
                    <h3>Result notes:</h3>
                    <br />
                    <p><strong>Entity Analysis</strong> feature extracts significant entities (people, locations, organizations..) from text and categorizes them by type.</p>
                    <p><strong>Salience Score</strong> measure their importance in the text, the higher the score the more important and prominent.</p>
                    <br />
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