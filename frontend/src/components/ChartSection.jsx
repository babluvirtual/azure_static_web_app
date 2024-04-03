import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import styled from "styled-components";
import { RotatingLines } from "react-loader-spinner";

const StyledSvg = styled.svg`
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const ScatterChart = ({ chartData, isChartDataLoading, isSubmitting }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sampleData = [
        {
          Offer_Relevance_Mandatory_Percent: 20,
          Offer_Utilisation_Mandatory_Percent: 30,
        },
        {
          Offer_Relevance_Mandatory_Percent: 40,
          Offer_Utilisation_Mandatory_Percent: 50,
        },
        {
          Offer_Relevance_Mandatory_Percent: 60,
          Offer_Utilisation_Mandatory_Percent: 70,
        },
      ];
      setData(sampleData);
    };

    fetchData();
  }, []);

  const renderChart = () => {
    if (chartData?.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Find minimums (now explicitly including 0)
    const minRelevance = Math.min(
      0,
      ...chartData?.map((d) => d.Offer_Relevance_Mandatory_Percent)
    );
    const minUtilisation = Math.min(
      0,
      ...chartData?.map((d) => d.Offer_Utilisation_Mandatory_Percent)
    );

    const xScale = d3
      .scaleLinear()
      .domain([minRelevance, 100])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([minUtilisation, 100])
      .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    return (
      <StyledSvg width={750} height={450}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <g
            className="x-axis"
            transform={`translate(0, ${height})`}
            ref={(node) => d3.select(node).call(xAxis)}
          />
          <g className="y-axis" ref={(node) => d3.select(node).call(yAxis)} />
          {chartData?.map((d, i) => (
            <circle
              key={i}
              cx={xScale(d.Offer_Relevance_Mandatory_Percent)}
              cy={yScale(d.Offer_Utilisation_Mandatory_Percent)}
              r={5}
              fill="steelblue"
            />
          ))}
          {/* Labels */}
          <text
            x={width / 2}
            y={height + margin.bottom / 2 + 30} // Adjusted y position for more margin
            textAnchor="middle"
            fill="#333"
          >
            Offer Relevance
          </text>
          <text
            transform="rotate(-90)"
            x={-height / 2}
            y={-margin.left + 20}
            textAnchor="middle"
            fill="#333"
          >
            Offer Utilisation
          </text>
        </g>
      </StyledSvg>
    );
  };

  return (
    <div>
      <h2>Offer Relevance vs. Utilisation</h2>
      {!isChartDataLoading && !isSubmitting ? (
        renderChart()
      ) : (
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      )}
    </div>
  );
};

export default ScatterChart;
