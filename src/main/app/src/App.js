import { Data } from './utils/Data';
import { LinearScale, Chart, PointElement, LineElement } from 'chart.js';
import ScoreChart from './components/ScoreChart';
import React, { useEffect, useState } from 'react';

Chart.register(LinearScale, PointElement, LineElement);

function compareScores(leftScore, rightScore) {
  if (leftScore.gameNum < rightScore.gameNum) {
    return -1;
  } else if (leftScore.gameNum === rightScore.gameNum) {
    if (leftScore.quarter < rightScore.quarter) {
      return -1;
    } else if (leftScore.quarter === rightScore.quarter) {
      if ((leftScore.minutesRemaining * 60 + leftScore.secondsRemaining) > (rightScore.minutesRemaining * 60 + rightScore.secondsRemaining)) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  } else {
    return 1;
  }
}

function processData(rawData) {
  const sortedScores = rawData.scores.sort(compareScores);
  var scores = [{time: 0, total: 0}];
  var prevScore = null;
  var runningTotal = 0;
  if (sortedScores.length > 0) {
    for (let i = 0 ; i < sortedScores.length ; i++) {
      let score = sortedScores[i];
      if (prevScore != null && score.gameNum !== prevScore.gameNum) {
        scores.push({time: prevScore.gameNum, total: runningTotal});
      }
      runningTotal += score.points;
      scores.push({time: getTime(score), total: runningTotal});
      prevScore = score;
    }
    if(rawData.games.filter(game => game.gameNum === prevScore.gameNum)[0].won !== null) {
      scores.push({time: prevScore.gameNum, total: runningTotal});
    }
  } else {
    scores = Data;
  }
  return scores;
}

function getTime(score) {
  var time = (score.gameNum - 1) * 3600
  time += score.quarter * 15 * 60;
  time -= (score.minutesRemaining * 60 + score.secondsRemaining);
  return time / 3600;
}

function App() {
   const [gameData, setGameData] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
     setLoading(true);
     fetch('api/gamedata')
       .then(response => response.json())
       .then(data => {
         setGameData(processData(data));
         setLoading(false);
       });
   }, []);
  if (loading) {
    return (
      <div className="App">
        <div className="container-xxl">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Brian Ferentz Point Tracker</h1>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    const chartData = {
      datasets: [{
        data: gameData.map(data => ({x: data.time, y: data.total})),
        borderColor: 'rgba(0, 0, 0, 1)',
        pointStyle: false
      },
      {
        data: [...Array(13).keys()].map(v => ({x: v, y: (v * 25)})),
        pointStyle: false,
        borderColor: 'rgba(255, 0, 0, 0.25)',
        stepped: 'after'
      }]
    };
    return (
      <div className="App">
        <div className="container-xxl">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Brian Ferentz Point Tracker</h1>
            </div>
          </div>
        </div>
        <div className="container">
          <ScoreChart chartData={chartData} />
        </div>
      </div>
    );
  }
}
export default App;