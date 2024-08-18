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

        const margin = { top: 100, right: 30, bottom: 60, left: 150 }; 
        const barHeight = 25;
        const width = 800;
        const height = Math.max(50, barHeight * data.length + margin.top + margin.bottom);
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const color = d3.scaleOrdinal<string>()
            .domain(data.map(d => d.type))
            .range(d3.schemeCategory10);

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.salience) || 0])
            .range([0, innerWidth]);

        const y = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([0, innerHeight])
            .padding(0.1);

        svg.attr("viewBox", `0 0 ${width} ${height}`)
           .attr("preserveAspectRatio", "xMidYMid meet");

        
        const legend = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top - 80})`); 

        const types = Array.from(new Set(data.map(d => d.type)));
        const legendRow1 = types.slice(0, Math.ceil(types.length / 2));
        const legendRow2 = types.slice(Math.ceil(types.length / 2));

        legendRow1.forEach((type, i) => {
            legend.append("rect")
                .attr("x", i * 100)
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", color(type));

            legend.append("text")
                .attr("x", i * 100 + 20)
                .attr("y", 10)
                .text(type)
                .style("font-size", '12px')
                .style("font-family", "Arial, sans-serif");
        });

        legendRow2.forEach((type, i) => {
            legend.append("rect")
                .attr("x", i * 100)
                .attr("y", 20)
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", color(type));

            legend.append("text")
                .attr("x", i * 100 + 20)
                .attr("y", 30)
                .text(type)
                .style("font-size", '12px')
                .style("font-family", "Arial, sans-serif");
        });

        
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("g")
            .call(d3.axisTop(x).ticks(width / 80))
            .attr("font-size", '12px');

        g.append("text")
            .attr("text-anchor", "middle")
            .attr("x", innerWidth / 2)
            .attr("y", -20)
            .text("Salience")
            .style("font-size", '14px')
            .style("font-family", "Arial, sans-serif");

        
        g.append("g")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", 0)
            .attr("y", d => y(d.name) || 0)
            .attr("width", d => x(d.salience))
            .attr("height", y.bandwidth())
            .attr("fill", d => color(d.type) as string);

        
        g.append("g")
            .call(d3.axisLeft(y).tickSize(0))
            .attr("font-size", '12px')
            .selectAll("text")
            .style("font-family", "Arial, sans-serif");

    }, [data]);

    return <svg ref={svgRef} className="entity-chart"></svg>;
};

export default EntityVisualization;
