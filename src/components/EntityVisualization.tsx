import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Dashboard.css';

interface Entity {
    name: string;
    type: string;
    salience: number;
}

interface EntityVisualization {
    data: Entity[];
}

const EntityVisualization: React.FC<EntityVisualization> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 40, left: 100 };
        const width = 800;
        const height = 400;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.salience) || 0])
            .range([0, innerWidth]);

        const y = d3.scaleBand()
            .domain(data.map(d => `${d.name} - ${d.type}`))
            .range([0, innerHeight])
            .padding(0.1);

        
        svg.attr("viewBox", `0 0 ${width} ${height}`)
           .attr("preserveAspectRatio", "xMidYMid meet");

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("g")
            .attr("fill", "#69b3a2")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", 0)
            .attr("y", d => y(`${d.name} - ${d.type}`) || 0)
            .attr("width", d => x(d.salience))
            .attr("height", y.bandwidth());

        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x).ticks(width / 80))
            .attr("font-size", '12px');

        g.append("g")
            .call(d3.axisLeft(y).tickSize(0))
            .attr("font-size", '12px');

        svg.selectAll("text")
            .style("font-family", "Arial, sans-serif");

    }, [data]);

    return <svg ref={svgRef} className="entity-chart"></svg>;
};

export default EntityVisualization;
