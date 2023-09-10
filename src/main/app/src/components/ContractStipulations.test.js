import { render, screen } from '@testing-library/react';
import ContractStipulations from './ContractStipulations';

test('renders positive point differential', () => {
  const gameData = {
    wins: [{}],
    losses: [],
    played: [{}],
    all: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  }
  const scoreData = [
    {time: 0, total: 30}
  ];
  render(<ContractStipulations gamesData={gameData} scoresData={scoreData} />);
  const requiredPointsElement = screen.getByText(/Required Points \(30 of 300\)/i);
  const pointsProgress = screen.getByText(/10% \(\+5\)/i);
  expect(requiredPointsElement).toBeInTheDocument();
  expect(pointsProgress).toBeInTheDocument();
  expect(pointsProgress).toHaveClass("bg-success");
});

test('renders negative point differential', () => {
  const gameData = {
    wins: [{}],
    losses: [],
    played: [{}],
    all: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  }
  const scoreData = [
    {time: 0, total: 20}
  ];
  render(<ContractStipulations gamesData={gameData} scoresData={scoreData} />);
  const requiredPointsElement = screen.getByText(/Required Points \(20 of 300\)/i);
  const requiredWinsElement = screen.getByText(/Required Wins \(1 of 7\)/i);
  const pointsProgress = screen.getByText(/7% \(-5\)/i);
  const winsProgress = screen.getByText(/15%/i);
  expect(requiredPointsElement).toBeInTheDocument();
  expect(pointsProgress).toBeInTheDocument();
  expect(pointsProgress).toHaveClass("bg-warning");
  expect(winsProgress).toBeInTheDocument();
  expect(winsProgress).toHaveClass("bg-success");
});

test('renders zero point differential and wins warning', () => {
  const gameData = {
    wins: [{}],
    losses: [{}],
    played: [{}, {}],
    all: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  }
  const scoreData = [
    {time: 0, total: 50}
  ];
  render(<ContractStipulations gamesData={gameData} scoresData={scoreData} />);
  const requiredPointsElement = screen.getByText(/Required Points \(50 of 300\)/i);
  const requiredWinsElement = screen.getByText(/Required Wins \(1 of 7\)/i);
  const pointsProgress = screen.getByText(/17% \(0\)/i);
  const winsProgress = screen.getByText(/15%/i);
  expect(requiredPointsElement).toBeInTheDocument();
  expect(requiredWinsElement).toBeInTheDocument();
  expect(pointsProgress).toBeInTheDocument();
  expect(pointsProgress).toHaveClass("bg-success");
  expect(winsProgress).toBeInTheDocument();
  expect(winsProgress).toHaveClass("bg-warning");
});