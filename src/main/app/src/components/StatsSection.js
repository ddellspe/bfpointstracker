import { processScoreData, processGameData } from '../utils/Scores';
import ScoreChart from './ScoreChart';
import ContractStipulations from './ContractStipulations';
import React, { useEffect, useState } from 'react';

function StatsSection() {
  const [gamesData, setGamesData] = useState({scores: [], games: []});
  const [err, setErr] = useState(true);

  useEffect(() => {
    const fetchGameData = async() => {
      try {
        const response = await fetch('api/gamedata')
        const data = await response.json()
        setGamesData(data);
        setErr(false);
      } catch (err) {
        setErr(true);
      }
      setTimeout(() => fetchGameData(), 30000);
    }
    fetchGameData();
  }, []);

  const scoreData = processScoreData(gamesData);
  const gameData = processGameData(gamesData);

  const chartData = {
    datasets: [{
      data: scoreData.map(data => ({x: data.time, y: data.total})),
      borderColor: 'rgba(0, 0, 0, 1)',
      pointStyle: 'circle',
      radius: 2
    },
    {
      data: [...Array(gameData.all.length + 1).keys()].map(v => ({x: v, y: (v * 25)})),
      pointStyle: false,
      borderColor: 'rgba(255, 0, 0, 0.3)',
      stepped: 'after'
    }]
  }
  return (
    <div className="container">
      {err &&
        <div className="alert alert-danger" role="alert">
          <p>API responded with an error, data may be stale.</p>
        </div>
      }
      <ScoreChart datasets={chartData}/>
      <ContractStipulations gamesData={gameData} scoresData={scoreData} />
    </div>
  );
}
export default StatsSection;