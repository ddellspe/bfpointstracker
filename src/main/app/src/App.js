import { Data } from './utils/Data';
import { LinearScale, Chart, PointElement, LineElement } from 'chart.js';
import ScoreChart from './components/ScoreChart';

Chart.register(LinearScale, PointElement, LineElement);

function App() {
  const chartData = {
    datasets: [{
      data: Data.map(data => ({x: data.time, y: data.total})),
      borderColor: 'rgba(0, 0, 0, 1)',
      fill: 'rgba(0, 0, 0, 1)'
    },
    {
      data: [{x: 0, y: 0}, {x: 12, y:300}],
      pointStyle: false,
      borderColor: 'rgba(255, 0, 0, 0.5)'
    }]
  };
  return (
    <div className="App">
      <div className="container-xxl">
        <div className="card">
          <div className="card-body">
            <h1 className="card-title">Brian Ferentz Point Tracker</h1>
            <p className="card-text">Coming Soon</p>
          </div>
        </div>
      </div>
      <div className="container">
        <ScoreChart chartData={chartData} />
      </div>
    </div>
  );
}
export default App;