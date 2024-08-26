import React from 'react';
import * as XLSX from 'xlsx';
import Button from '@mui/material/Button';
import { FaFileExcel } from 'react-icons/fa';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

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

const EntitySentimentTable: React.FC<{ data: any[] }> = ({ data }) => {

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(entity => ({
            name: entity.name,
            type: entity.type,
            sentimentScore: entity.sentiment.score,
            magnitude: entity.sentiment.magnitude,
            salience: entity.salience,
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Entity Sentiment Analysis');
        XLSX.writeFile(workbook, 'entity_sentiment_analysis.xlsx');
    };

    const exportToCSV = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(entity => ({
            'Name': entity.name !== undefined ? entity.name : 'N/A',
            'Type': entity.type !== undefined ? entity.type : 'N/A',
            'Sentiment Score': entity.sentiment && entity.sentiment.score !== undefined ? entity.sentiment.score : 'N/A',
            'Magnitude': entity.sentiment && entity.sentiment.magnitude !== undefined ? entity.sentiment.magnitude : 'N/A',
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
                            {entity.sentiment ? entity.sentiment.score.toFixed(2) : 'N/A'}
                        </td>
                        <td data-label="Magnitude">
                            {entity.sentiment ? entity.sentiment.magnitude.toFixed(2) : 'N/A'}
                        </td>
                        <td data-label="Salience">{entity.salience.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
};

export default EntitySentimentTable;
