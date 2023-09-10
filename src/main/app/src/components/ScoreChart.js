import { LinearScale, Chart, PointElement, LineElement } from 'chart.js';
import { Scatter } from "react-chartjs-2";

Chart.register(LinearScale, PointElement, LineElement);

function ScoreChart({datasets}) {
  return(
    <div className="container">
      <div className="row py-2">
        <div className="col">
          <h2>Score Progress</h2>
        </div>
      </div>
      <div className="chart-container">
        <Scatter
          data={datasets}
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
                  display: true,
                  count: 13
                },
                title: {
                  display: true,
                  text: 'Games Played',
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