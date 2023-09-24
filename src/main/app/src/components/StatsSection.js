import { processScoreData, processGameData } from '../utils/Scores';
import ScoreChartContainer from './ScoreChartContainer';
import ContractStipulations from './ContractStipulations';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ReactGA from 'react-ga4';

function StatsSection() {
  const [gamesData, setGamesData] = useState({scores: [], games: []});
  const [err, setErr] = useState(true);

  useEffect(() => {
    const fetchGameData = async() => {
      try {
        const response = await fetch('api/gamedata')
        const data = await response.json()
        setGamesData(data);
        ReactGA.event('dataReload')
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

  const chartData = scoreData.map(data => ({
    time: data.time,
    points: data.total,
    goal: 25 * Math.ceil(data.time)
  }));
  return (
    <Box>
      {err &&
        <div className="alert alert-danger" role="alert">
          <p>API responded with an error, data may be stale.</p>
        </div>
      }
      <ScoreChartContainer gameData={chartData}/>
      <ContractStipulations gamesData={gameData} scoresData={scoreData} />
    </Box>
  );
}
export default StatsSection;