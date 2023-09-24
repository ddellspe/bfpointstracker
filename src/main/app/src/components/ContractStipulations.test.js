import { render, screen } from '@testing-library/react';
import ContractStipulations from './ContractStipulations';


const mockLinearProgress = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
})

jest.mock("@mui/material/LinearProgress", () => (props) => {
  mockLinearProgress(props);
  return <div>score chart</div>;
});

test('renders no values when no scores', () => {
  const gameData = {
    wins: [],
    losses: [],
    played: [],
    all: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  }
  const scoreData = [];
  render(<ContractStipulations gamesData={gameData} scoresData={scoreData} />);
  const requiredPointsElement = screen.getByText(/Required Points \(0 of 300\)/i);
  const pointsProgress = screen.getByText(/0% \(0\)/i);
  expect(requiredPointsElement).toBeInTheDocument();
  expect(pointsProgress).toBeInTheDocument();
  expect(mockLinearProgress).toHaveBeenCalledWith({
    sx:{
      height: 16
    },
    variant:"buffer",
    value:0,
    valueBuffer:0,
    color:"success"
  });
});

test('renders positive point differential', () => {
  const gameData = {
    wins: [{}],
    losses: [],
    played: [{}],
    all: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  }
  const scoreData = [
    {time: 1, total: 30}
  ];
  render(<ContractStipulations gamesData={gameData} scoresData={scoreData} />);
  const requiredPointsElement = screen.getByText(/Required Points \(30 of 300\)/i);
  const pointsProgress = screen.getByText(/10% \(\+5\)/i);
  expect(requiredPointsElement).toBeInTheDocument();
  expect(pointsProgress).toBeInTheDocument();
  // games
  expect(mockLinearProgress).toHaveBeenCalledWith({
    sx:{
      height: 16
    },
    variant:"buffer",
    value: 15,
    valueBuffer: 8,
    color:"success"
  });
  // points
  expect(mockLinearProgress).toHaveBeenCalledWith({
    sx:{
      height: 16
    },
    variant:"buffer",
    value: 10,
    valueBuffer: 9,
    color:"success"
  });
});

test('renders negative point differential', () => {
  const gameData = {
    wins: [{}],
    losses: [],
    played: [{}],
    all: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  }
  const scoreData = [
    {time: 1, total: 20}
  ];
  render(<ContractStipulations gamesData={gameData} scoresData={scoreData} />);
  const requiredPointsElement = screen.getByText(/Required Points \(20 of 300\)/i);
  const requiredWinsElement = screen.getByText(/Required Wins \(1 of 7\)/i);
  const pointsProgress = screen.getByText(/7% \(-5\)/i);
  const winsProgress = screen.getByText(/15%/i);
  expect(requiredPointsElement).toBeInTheDocument();
  expect(pointsProgress).toBeInTheDocument();
  expect(mockLinearProgress).toHaveBeenCalledWith({
    sx:{
      height: 16
    },
    variant:"buffer",
    value: 7,
    valueBuffer: 9,
    color:"warning"
  });
  expect(winsProgress).toBeInTheDocument();
  expect(mockLinearProgress).toHaveBeenCalledWith({
    sx:{
      height: 16
    },
    variant:"buffer",
    value: 15,
    valueBuffer: 8,
    color:"success"
  });
});

test('renders zero point differential and wins warning', () => {
  const gameData = {
    wins: [{}],
    losses: [{}],
    played: [{}, {}],
    all: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  }
  const scoreData = [
    {time: 2, total: 50}
  ];
  render(<ContractStipulations gamesData={gameData} scoresData={scoreData} />);
  const requiredPointsElement = screen.getByText(/Required Points \(50 of 300\)/i);
  const requiredWinsElement = screen.getByText(/Required Wins \(1 of 7\)/i);
  const pointsProgress = screen.getByText(/17% \(0\)/i);
  const winsProgress = screen.getByText(/15%/i);
  expect(requiredPointsElement).toBeInTheDocument();
  expect(requiredWinsElement).toBeInTheDocument();
  expect(pointsProgress).toBeInTheDocument();
  expect(mockLinearProgress).toHaveBeenCalledWith({
    sx:{
      height: 16
    },
    variant:"buffer",
    value: 17,
    valueBuffer: 17,
    color:"success"
  });
  expect(winsProgress).toBeInTheDocument();
  expect(mockLinearProgress).toHaveBeenCalledWith({
    sx:{
      height: 16
    },
    variant:"buffer",
    value: 15,
    valueBuffer: 15,
    color:"warning"
  });
});

test('renders minus 5 point differential when game in progress', () => {
  const gameData = {
    wins: [{}],
    losses: [{}],
    played: [{}, {}],
    all: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  }
  const scoreData = [
    {time: 1, total: 25},
    {time: 2, total: 50},
    {time: 2.5, total: 70}
  ];
  render(<ContractStipulations gamesData={gameData} scoresData={scoreData} />);
  const requiredPointsElement = screen.getByText(/Required Points \(70 of 300\)/i);
  const requiredWinsElement = screen.getByText(/Required Wins \(1 of 7\)/i);
  const pointsProgress = screen.getByText(/24% \(\-5\)/i);
  const winsProgress = screen.getByText(/15%/i);
  expect(requiredPointsElement).toBeInTheDocument();
  expect(requiredWinsElement).toBeInTheDocument();
  expect(pointsProgress).toBeInTheDocument();
  expect(mockLinearProgress).toHaveBeenCalledWith({
    sx:{
      height: 16
    },
    variant:"buffer",
    value: 24,
    valueBuffer: 25,
    color:"warning"
  });
  expect(winsProgress).toBeInTheDocument();
  expect(mockLinearProgress).toHaveBeenCalledWith({
    sx:{
      height: 16
    },
    variant:"buffer",
    value: 15,
    valueBuffer: 15,
    color:"warning"
  });
});