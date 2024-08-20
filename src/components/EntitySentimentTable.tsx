import React from 'react';

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
    return (
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
    );
};

export default EntitySentimentTable;
