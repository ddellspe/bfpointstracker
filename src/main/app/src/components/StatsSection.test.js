import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import React from 'react';
import StatsSection from './StatsSection';

const mockScoreChartContainer = jest.fn();
const mockContractStipulations = jest.fn();

beforeEach(() => {
  fetchMock.resetMocks();
  jest.resetAllMocks();
  jest.useFakeTimers();
})

afterEach(() => {
  jest.useRealTimers();
});

jest.mock("./ScoreChartContainer", () => (props) => {
  mockScoreChartContainer(props);
  return <div>score chart</div>;
});

jest.mock("./ContractStipulations", () => (props) => {
  mockContractStipulations(props);
  return <div>contract stipulation</div>;
});

test('calls come through when API call fails', async () => {
  fetchMock.mockReject(() => Promise.reject('API Error'));

  await act(async () =>{
    render(<StatsSection />);
  });
  expect(await screen.findByText('API responded with an error, data may be stale.')).toBeInTheDocument();
  expect(mockScoreChartContainer).toHaveBeenCalledWith({
    gameData: [
      {
        time: 0,
        goal: 0,
        points: 0
      }
    ]
  });
  expect(mockContractStipulations).toHaveBeenCalledWith({
    gamesData: {wins: [], losses: [], played: [], all: []},
    scoresData: [{time: 0, total: 0}]
  });
  act(() => {
    jest.advanceTimersByTime(30000);
  })
  expect(await screen.findByText('API responded with an error, data may be stale.')).toBeInTheDocument();
});

test('calls come through when API call succeeds', async () => {
  const fakeData = {
    scores: [],
    games: []
  };

  fetchMock.mockResolvedValue({status: 200, json: jest.fn(() => fakeData)});

  render(<StatsSection />);

  await waitForElementToBeRemoved(() => screen.queryByText('API responded with an error, data may be stale.'));

  expect(mockScoreChartContainer).toHaveBeenCalledWith({
    gameData: [
      {
        time: 0,
        goal: 0,
        points: 0
      }
    ]
  });
  expect(mockContractStipulations).toHaveBeenCalledWith({
    gamesData: {wins: [], losses: [], played: [], all: []},
    scoresData: [{time: 0, total: 0}]
  });
});