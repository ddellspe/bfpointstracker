import { ParentSize } from '@visx/responsive';
import ScoreChart from './ScoreChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ScoreChartContainer({gameData}) {
  return (
    <Box sx={{ my: 2 }}>
      <Box>
        <Typography align="left" variant="h4" component="h2" gutterBottom>
          Score Progress
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <ParentSize>
          {({ width, height }) => <ScoreChart width={width} height={height} gameData={gameData} />}
        </ParentSize>
      </Box>
    </Box>
  );
};