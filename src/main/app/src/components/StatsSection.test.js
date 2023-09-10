import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import React from 'react';
import StatsSection from './StatsSection';

const mockScoreChart = jest.fn();
const mockContractStipulations = jest.fn();

beforeEach(() => {
  fetchMock.resetMocks();
  jest.resetAllMocks();
})

jest.mock("./ScoreChart", () => (props) => {
  mockScoreChart(props);
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
  expect(mockScoreChart).toHaveBeenCalledWith({
    datasets: {
      datasets: [{
        data: [{x: 0, y: 0}],
        borderColor: 'rgba(0, 0, 0, 1)',
        pointStyle: 'circle',
        radius: 2
      },
      {
        data: [{x: 0, y: 0}],
        pointStyle: false,
        borderColor: 'rgba(255, 0, 0, 0.3)',
        stepped: 'after'
      }]
    }
  });
  expect(mockContractStipulations).toHaveBeenCalledWith({
    gamesData: {wins: [], losses: [], played: [], all: []},
    scoresData: [{time: 0, total: 0}]
  });
});

test('calls come through when API call succeeds', async () => {
  const fakeData = {
    scores: [],
    games: []
  };

  fetchMock.mockResolvedValue({status: 200, json: jest.fn(() => fakeData)});

  render(<StatsSection />);

  await waitForElementToBeRemoved(() => screen.queryByText('API responded with an error, data may be stale.'));

  expect(mockScoreChart).toHaveBeenCalledWith({
    datasets: {
      datasets: [{
        data: [{x: 0, y: 0}],
        borderColor: 'rgba(0, 0, 0, 1)',
        pointStyle: 'circle',
        radius: 2
      },
      {
        data: [{x: 0, y: 0}],
        pointStyle: false,
        borderColor: 'rgba(255, 0, 0, 0.3)',
        stepped: 'after'
      }]
    }
  });
  expect(mockContractStipulations).toHaveBeenCalledWith({
    gamesData: {wins: [], losses: [], played: [], all: []},
    scoresData: [{time: 0, total: 0}]
  });
});