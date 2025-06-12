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
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import DecryptedText from "./Misc/DecryptedText";

interface EntityAnalysisProps {
    text: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EntityAnalysis: React.FC<EntityAnalysisProps> = ({text, onChange}) => {
    const [entities, setEntities] = useState<{ name:string, type: string, salience: number} [] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastCallTime, setLastCallTime] = useState<number | null>(null);
    const throttleDelay = 60000;
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const triggerSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    };

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
        ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
        });

    const analyzeEntities = async () => {
        if (!text) {
            triggerSnackbar("Please enter text.");
            return;
        }
        if (text.length > 1000) {
            triggerSnackbar("Text exceeds 1000 character limit.");
        }

        const now = Date.now();
        if (lastCallTime && now - lastCallTime < throttleDelay) {
            triggerSnackbar("Please wait before analyzing again.");
            return;
        }
        setLastCallTime(now);
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                'https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeEntities',
                { params: {text: text}}
            );
            setEntities(response.data.entities);
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                triggerSnackbar(error.response.data || 'Text exceeds limit or is invalid.');
            } else {
                triggerSnackbar('Unexpected error analyzing entities, please try again later.');
            }
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

    const exportToCSV = () => {
        if (!text || !entities) return;
    
        const worksheet = XLSX.utils.json_to_sheet(entities.map(entity => ({
            'Entity': entity.name !== undefined ? entity.name : 'N/A',
            'Type': entity.type !== undefined ? entity.type : 'N/A',
            'Salience': entity.salience !== undefined ? entity.salience : 'N/A'
        })));
    
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'entity_analysis.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

                {/* display snack errors */}
                <Snackbar open={showSnackbar} 
                        autoHideDuration={4000} 
                        onClose={() => setShowSnackbar(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        sx={{ zIndex: 9999 }}
                        >
                      <Alert
                        onClose={() => setShowSnackbar(false)}
                        severity="warning"
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

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
                            startIcon={<FaFileExcel />}>Export to XLSX
                        </Button>
                        <Button
                            variant="contained" 
                            color="primary" 
                            onClick={exportToCSV}
                            startIcon={<TextSnippetIcon />}>Export to CSV
                        </Button>
                    </div>
                    <DecryptedText
                        text="Result notes:"
                        animateOn="view"
                        sequential={true}
                        speed={30}
                        />

                        <br />

                        <p>
                        <strong>
                            <DecryptedText
                            text="Entity Analysis"
                            animateOn="view"
                            sequential={true}
                            speed={100}
                            />
                        </strong>{' '}
                        <DecryptedText
                            text="feature extracts significant entities (people, locations, organizations..) from text and categorizes them by type."
                            animateOn="view"
                            sequential={true}
                            speed={100}
                        />
                        </p>

                        <p>
                        <strong>
                            <DecryptedText
                            text="Salience Score"
                            animateOn="view"
                            sequential={true}
                            speed={100}
                            />
                        </strong>{' '}
                        <DecryptedText
                            text="measure their importance in the text, the higher the score the more important and prominent."
                            animateOn="view"
                            sequential={true}
                            speed={100}
                        />
                        </p>

                        <br />

                        <DecryptedText
                        text="Entities"
                        animateOn="view"
                        sequential={true}
                        speed={100}
                        />
                <EntityVisualization data={entities} />
                
                <h3>
                <DecryptedText text="Entities list" animateOn="view" sequential={true} speed={30} />
                </h3>

                <ul>
                {entities.map((entity, index) => (
                    <li key={index}>
                    <strong>
                        <DecryptedText
                        text={entity.name}
                        animateOn="view"
                        sequential={true}
                        speed={100}
                        />
                    </strong>{' '}
                    -{' '}
                    <DecryptedText
                        text={entity.type}
                        animateOn="view"
                        sequential={true}
                        speed={100}
                    />{' '}
                    (Salience:{' '}
                    <DecryptedText
                        text={entity.salience.toPrecision(6)}
                        animateOn="view"
                        sequential={true}
                        speed={100}
                    />
                    )
                    </li>
                ))}
                </ul>
            </div>
                
            
            )}
        </div>
    );
};

export default EntityAnalysis;