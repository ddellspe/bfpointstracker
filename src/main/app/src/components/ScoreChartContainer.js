import { ParentSize } from '@visx/responsive';
import ScoreChart from './ScoreChart';

export default function ScoreChartContainer({gameData}) {
  return (
    <div className="container">
      <div className="row py-2">
        <div className="col">
          <h2>Score Progress</h2>
        </div>
      </div>
      <div className="chart-container">
        <ParentSize>
          {({ width, height }) => <ScoreChart width={width} height={height} gameData={gameData} />}
        </ParentSize>
      </div>
    </div>
  );
};