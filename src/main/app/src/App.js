import ScoreChart from './components/ScoreChart';

function App() {
  return (
    <div className="App">
      <div className="container-xxl">
        <div className="card">
          <div className="card-body">
            <h1 className="card-title">Brian Ferentz Point Tracker</h1>
          </div>
        </div>
      </div>
      <ScoreChart />
    </div>
  );
}
export default App;