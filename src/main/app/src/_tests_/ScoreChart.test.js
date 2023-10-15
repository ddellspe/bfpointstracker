import { render, screen } from '@testing-library/react';
import ScoreChart from '../components/ScoreChart';

test('ScoreChart shows when width is greater than 10', () => {
  const data = [
    {
      time: 0,
      goal: 0,
      points: 0
    }
  ];
  const width = 11;
  const height = 100;
  render(<ScoreChart width={width} height={height} gameData={data}/>)
  expect(screen.getByText(/Games Played/i)).toBeInTheDocument();
});

test('ScoreChart shows when width is greater than 10 with data issues', () => {
  const data = [
    {
      time: 0
    },
    {
      goal: 0
    }
  ];
  const width = 11;
  const height = 100;
  render(<ScoreChart width={width} height={height} gameData={data}/>)
  expect(screen.getByText(/Games Played/i)).toBeInTheDocument();
});

test('ScoreChart all games played width is greater than 520 and more than 5 games', () => {
  const data = [
    {time: 0,goal: 0, points: 0},
    {time: 1, goal: 25, points: 25},
    {time: 2, goal: 50, points: 50},
    {time: 3, goal: 75, points: 75},
    {time: 4, goal: 100, points: 100},
    {time: 5, goal: 125, points: 125},
    {time: 6, goal: 150, points: 150},
    {time: 7, goal: 175, points: 175}
  ];
  const width = 535;
  const height = 100;
  render(<ScoreChart width={width} height={height} gameData={data}/>)
  expect(screen.getByText(/Games Played/i)).toBeInTheDocument();
});

test('ScoreChart no odd games played width is less than 520 and more than 5 games', () => {
  const data = [
    {time: 0,goal: 0, points: 0},
    {time: 1, goal: 25, points: 25},
    {time: 2, goal: 50, points: 50},
    {time: 3, goal: 75, points: 75},
    {time: 4, goal: 100, points: 100},
    {time: 5, goal: 125, points: 125},
    {time: 6, goal: 150, points: 150},
    {time: 7, goal: 175, points: 175}
  ];
  const width = 250;
  const height = 100;
  render(<ScoreChart width={width} height={height} gameData={data}/>)
  expect(screen.queryByText(/1\.0/i)).not.toBeInTheDocument();
});