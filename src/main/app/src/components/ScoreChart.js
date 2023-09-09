import React from "react";
import { Scatter } from "react-chartjs-2";

function ScoreChart({ chartData }) {
  return (
    <div className="chart-container">
      <Scatter
        data={chartData}
        options={{
          showLine: true,
          responsive: true,
          scales: {
            y: {
              min: 0,
              suggestedMax: 300,
              border: {
                display: false
              },
              grid: {
                display: false
              },
              ticks: {
                display: false
              }
            },
            x: {
              min: 0,
              suggestedMax: 12,
              border: {
                display: false
              },
              grid: {
                display: false
              },
              ticks: {
                display: false
              }
            }
          }
        }}
      />
    </div>
  );
}
export default ScoreChart;