import React from 'react';

interface EntityDatum {
    name: string;
    type: string;
    sentimentScore: number | undefined;
    magnitude: number | undefined;
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
                    <th>Sentiment Score</th>
                    <th>Magnitude</th>
                </tr>
            </thead>
            <tbody>
                {data.map((entity, index) => (
                    <tr key={index}>
                        <td>{entity.name}</td>
                        <td>{entity.type}</td>
                        <td>{entity.sentiment ? entity.sentiment.score.toFixed(2) : 'N/A'}</td>
                        <td>{entity.sentiment ? entity.sentiment.magnitude.toFixed(2) : 'N/A'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default EntitySentimentTable;
