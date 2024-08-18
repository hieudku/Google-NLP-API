import React from 'react';
import * as d3 from 'd3';

interface SentimentPieChartIF {
    data: {
        positive: number;
        neutral: number;
        negative: number;
    };
}

interface PieData {
    type: string;
    value: number;
}

const SentimentPieChart: React.FC<SentimentPieChartIF> = ({ data }) => {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Define custom colors for each sentiment
    const color = d3.scaleOrdinal<string>()
        .domain(['positive', 'neutral', 'negative'])
        .range(['#4CAF50', '#B9B9B9', '#F44336']); // Green, Yellow, Red

    const pie = d3.pie<PieData>().value(d => d.value);
    const arc = d3.arc<d3.PieArcDatum<PieData>>()
        .outerRadius(radius)
        .innerRadius(0);

    const dataReady = pie(
        Object.entries(data).map(([key, value]) => ({ type: key, value }))
    );

    return (
        <svg width={width} height={height}>
            <g transform={`translate(${width / 2},${height / 2})`}>
                {dataReady.map((d, i) => (
                    <path
                        key={i}
                        d={arc(d) || undefined}
                        fill={color(d.data.type)} // Now TypeScript understands `type` is a string
                    />
                ))}
            </g>
        </svg>
    );
};

export default SentimentPieChart;
