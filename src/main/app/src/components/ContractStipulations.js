import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

function ContractStipulations({gamesData, scoresData}) {
  const gamesAvailable = gamesData.all.length;
  const gamesWon = gamesData.wins.length;
  const gamesPlayed = gamesData.played.length;
  const gameWinProgress = Math.ceil(gamesWon / 7 * 100);
  const expectedGameWinProgress = Math.ceil((gamesPlayed / 2) / 7 * 100);
  const winPercentage = gamesWon / gamesPlayed;
  const gamesColor = (winPercentage <= 0.5 ? "warning" : "success");

  const pointsScored = scoresData.length === 0 ? 0 : scoresData[scoresData.length - 1].total;
  const gamesPlaying = scoresData.length === 0 ? 0 : Math.max(gamesData.played.length, Math.ceil(scoresData[scoresData.length - 1].time));
  const pointsExpected = gamesAvailable * 25
  const pointsMadeProgress = Math.ceil(pointsScored / pointsExpected * 100)
  const pointsNeededProgress = Math.ceil((gamesPlaying * 25) / pointsExpected * 100)
  const pointsAverage = pointsScored / gamesPlaying;
  const pointsScoredColor = (pointsAverage < 25 ? "warning" : "success" );

  const pointDiff = gamesPlaying * 25 - pointsScored;
  const sign = pointDiff < 0 ? "+" : (pointDiff === 0 ? "" : "-");
  const differential = sign + Math.abs(pointDiff);

  return (
    <Box>
      <Box sx={{my:5}}>
        <Typography align="left" variant="h4" component="h2" gutterBottom>
          Contract Stipulations
        </Typography>
      </Box>
      <Box sx={{my:5}}>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <Typography align="left" variant="h5" component="h3" gutterBottom>
            Required Wins ({gamesWon} of 7)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress
                sx={{
                  height: 16
                }}
                variant="buffer"
                value={gameWinProgress}
                valueBuffer={expectedGameWinProgress}
                color={gamesColor} />
          </Box>
          <Box sx={{ minWidth: 75 }}>
            <Typography variant="body1" align="right">
              {gameWinProgress}%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{my:5}}>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <Typography align="left" variant="h5" component="h3" gutterBottom>
            Required Points ({pointsScored} of {pointsExpected})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress
                sx={{
                  height: 16
                }}
                color={pointsScoredColor}
                variant="buffer"
                value={pointsMadeProgress}
                valueBuffer={pointsNeededProgress} />
          </Box>
          <Box sx={{ minWidth: 75 }}>
            <Typography variant="body1" align="right">
              {pointsMadeProgress}% ({differential})
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default ContractStipulations;