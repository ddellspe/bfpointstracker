import { render, screen } from '@testing-library/react';
import ScoreChartContainer from '../components/ScoreChartContainer';
import ResizeObserver from 'resize-observer-polyfill';

window.ResizeObserver = ResizeObserver;

test('ScoreChartContainer has appropriate title', () => {
  const data = [
    {
      time: 0,
      goal: 0,
      points: 0
    }
  ];
  render(<ScoreChartContainer gameData={data}/>)
  expect(screen.getByText(/Score Progress/i)).toBeInTheDocument();
});