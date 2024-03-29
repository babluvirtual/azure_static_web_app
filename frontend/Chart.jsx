import React, { useState, useEffect } from "react";
import * as d3 from "d3";

function ScatterChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/get-offer-data");
      const offerData = await response.json();
      setData(offerData);
    };

    fetchData();
  }, []);

  const renderChart = () => {
    if (data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = 800;
    const height = 500;

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.Offer_Relevance_Mandatory_Percent))
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.Offer_Utilisation_Mandatory_Percent))
      .range([height - margin.bottom, margin.top]);

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(d.Offer_Relevance_Mandatory_Percent)}
              cy={yScale(d.Offer_Utilisation_Mandatory_Percent)}
              r={5}
              fill="steelblue"
            />
          ))}
          <g transform={`translate(0, ${height - margin.bottom})`}>
            <text x={width / 2} y={margin.bottom - 10} textAnchor="middle">
              Offer Relevance
            </text>
            <g transform="rotate(-90)">
              <text x={-height / 2} y={-margin.left + 20} textAnchor="middle">
                Offer Utilisation
              </text>
            </g>
          </g>
        </g>
      </svg>
    );
  };

  return (
    <div>
      <h2>Offer Relevance vs. Utilisation</h2>
      <div id="scatter-chart">{renderChart()}</div>
    </div>
  );
}

export default ScatterChart;
