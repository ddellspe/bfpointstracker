import { LinearScale, Chart, PointElement, LineElement } from 'chart.js';
import { processData } from '../Scores';
import { Scatter } from "react-chartjs-2";
import React, { useEffect, useState } from 'react';

Chart.register(LinearScale, PointElement, LineElement);

function fetchData(setScoreData) {
  fetch('api/gamedata')
    .then((response) => response.json())
    .then((data) => {
      setScoreData(processData(data));
    })
    .catch((err) => {
      return
    });
  setTimeout(() => fetchData(setScoreData), 30000);
}

function ScoreChart() {
  const [scoreData, setScoreData] = useState([]);

  useEffect(() => {
    fetchData(setScoreData);
  }, []);
  const chartData = {
    datasets: [{
      data: scoreData.map(data => ({x: data.time, y: data.total})),
      borderColor: 'rgba(0, 0, 0, 1)',
      pointStyle: 'circle',
      radius: 2
    },
    {
      data: [...Array(13).keys()].map(v => ({x: v, y: (v * 25)})),
      pointStyle: false,
      borderColor: 'rgba(255, 0, 0, 0.25)',
      stepped: 'after'
    }]
  };
  return (
    <div className="container">
      <div className="chart-container">
        <Scatter
          data={chartData}
          options={{
            animation: false,
            showLine: true,
            clip: 5,
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
                  display: true,
                  font: {
                    size: 16
                  }
                },
                title: {
                  display: true,
                  text: 'Cumulative Points',
                  font: {
                    size: 20
                  }
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
                },
                title: {
                  display: true,
                  text: 'Game',
                  font: {
                    size: 20
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}
export default ScoreChart;