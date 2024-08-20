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

const EntitySentimentTable: React.FC<EntitySentimentTableProps> = ({ data }) => {
    const sortedData = [...data].sort((a, b) => (b.sentimentScore ?? 0) - (a.sentimentScore ?? 0));

    return (
        <div className="table-container">
            <h3>Entities and Sentiments</h3>
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
                    {sortedData.map((entity, index) => (
                        <tr key={index}>
                            <td>{entity.name}</td>
                            <td>{entity.type}</td>
                            <td>{entity.sentimentScore !== undefined ? entity.sentimentScore.toFixed(2) : 'N/A'}</td>
                            <td>{entity.magnitude !== undefined ? entity.magnitude.toFixed(2) : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EntitySentimentTable;
