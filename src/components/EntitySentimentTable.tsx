import React from 'react';
import * as XLSX from 'xlsx';

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

    return (
        <div>
        <div className="export-buttons">
                <button onClick={exportToExcel}>Export to Excel</button>
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
