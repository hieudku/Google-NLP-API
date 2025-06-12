import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Button from '@mui/material/Button';
import { FaFileExcel } from 'react-icons/fa';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface EntityDatum {
    name: string;
    type: string;
    sentimentScore: number | undefined;
    magnitude: number | undefined;
    salience: number;
}

interface EntitySentimentTableProps {
    data: EntityDatum[];
}

const EntitySentimentTable: React.FC<EntitySentimentTableProps> = ({ data }) => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [lastExportTime, setLastExportTime] = useState<number | null>(null);
    const throttleDelay = 60000;

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleThrottle = (): boolean => {
        const now = Date.now();
        if (lastExportTime && now - lastExportTime < throttleDelay) {
            setSnackbarMessage('Please wait before exporting again.');
            setShowSnackbar(true);
            return true;
        }
        setLastExportTime(now);
        return false;
    };

    const exportToExcel = () => {
        if (!data || data.length === 0) {
            setSnackbarMessage('No data available to export.');
            setShowSnackbar(true);
            return;
        }
        if (handleThrottle()) return;

        const worksheet = XLSX.utils.json_to_sheet(data.map(entity => ({
            name: entity.name,
            type: entity.type,
            sentimentScore: entity.sentimentScore,
            magnitude: entity.magnitude,
            salience: entity.salience,
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Entity Sentiment Analysis');
        XLSX.writeFile(workbook, 'entity_sentiment_analysis.xlsx');
    };

    const exportToCSV = () => {
        if (!data || data.length === 0) {
            setSnackbarMessage('No data available to export.');
            setShowSnackbar(true);
            return;
        }
        if (handleThrottle()) return;

        const worksheet = XLSX.utils.json_to_sheet(data.map(entity => ({
            'Name': entity.name !== undefined ? entity.name : 'N/A',
            'Type': entity.type !== undefined ? entity.type : 'N/A',
            'Sentiment Score': entity.sentimentScore !== undefined ? entity.sentimentScore : 'N/A',
            'Magnitude': entity.magnitude !== undefined ? entity.magnitude : 'N/A',
            'Salience': entity.salience !== undefined ? entity.salience : 'N/A',
        })));

        const csv = XLSX.utils.sheet_to_csv(worksheet);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'entity_sentiment_analysis.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="export-buttons">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={exportToExcel}
                    startIcon={<FaFileExcel />}>Export to Excel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={exportToCSV}
                    startIcon={<TextSnippetIcon />}>Export to CSV
                </Button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Entity</th>
                        <th>Type</th>
                        <th>Sent. Score</th>
                        <th>Magnitude</th>
                        <th>Salience</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entity, index) => (
                        <tr key={index}>
                            <td data-label="Entity Name">{entity.name}</td>
                            <td data-label="Type">{entity.type}</td>
                            <td data-label="Sent. Score">
                                {entity.sentimentScore !== undefined ? entity.sentimentScore.toFixed(2) : 'N/A'}
                            </td>
                            <td data-label="Magnitude">
                                {entity.magnitude !== undefined ? entity.magnitude.toFixed(2) : 'N/A'}
                            </td>
                            <td data-label="Salience">{entity.salience.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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

export default EntitySentimentTable;
