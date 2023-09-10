import { processScoreData, processGameData } from '../utils/Scores';
import ScoreChart from './ScoreChart';
import ContractStipulations from './ContractStipulations';
import React, { useEffect, useState } from 'react';

function fetchData(setScoreData, setGameData) {
  fetch('api/gamedata')
    .then((response) => response.json())
    .then((data) => {
      setScoreData(processScoreData(data));
      setGameData(processGameData(data));
    })
    .catch((err) => {
      return
    });
  setTimeout(() => fetchData(setScoreData, setGameData), 30000);
}

function StatsSection() {
  const [scoreData, setScoreData] = useState([]);
  const [gameData, setGameData] = useState({wins: [], losses: [], played: [], all:[]});

  useEffect(() => {
    fetchData(setScoreData, setGameData);
  }, []);
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
      <ScoreChart datasets={chartData}/>
      <ContractStipulations gamesData={gameData} scoresData={scoreData} />
    </div>
  );
}
export default StatsSection;