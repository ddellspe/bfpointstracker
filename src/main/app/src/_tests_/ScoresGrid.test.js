import { render, screen, fireEvent, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ScoresGrid from '../components/ScoresGrid';

beforeEach(() => {
  fetch.resetMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const mockScoreForm = jest.fn();

jest.mock("../components/ScoreForm", () => (props) => {
  mockScoreForm(props);
  return <div>score form</div>;
});

test('when opened false no display', () => {
  const opened = false
  const creds = undefined
  const onClose = jest.fn();

  render(<ScoresGrid opened={opened} creds={creds} onClose={onClose} />)

  expect(screen.queryByText(/Scores Listing/)).not.toBeInTheDocument();
});

test('when opened true, creds undefined shows title, no buttons', () => {
  const opened = true
  const creds = undefined
  const onClose = jest.fn();

  render(<ScoresGrid opened={opened} creds={creds} onClose={onClose} />)

  expect(screen.queryByText(/Scores Listing/)).toBeInTheDocument();
  expect(screen.queryByText(/Add Score/)).not.toBeInTheDocument();
});

test('when opened true, creds defined fetches data', async () => {
  const opened = true
  const creds = "blah"
  const onClose = jest.fn();

  fetch.mockResolvedValueOnce({ok: true, json: () => {
    return [
      {
        "id": 1,
        "gameNum": 1,
        "quarter": 2,
        "minutesRemaining": 10,
        "secondsRemaining": 30,
        "points": 2
      },
      {
        "id": 2,
        "gameNum": 1,
        "quarter": 3,
        "minutesRemaining": 10,
        "secondsRemaining": 30,
        "points": 3
      }
    ]
  }});
  fetch.mockResolvedValueOnce({ok: true, json: () => {
    return [
      {
        "gameNum": 1,
        "opponent": "Opponent",
        "opponentLogo": "https://google.com",
        "won": null,
        "date": "2023-08-10T19:00:00.000Z"
      }
    ]
  }});

  await act(async () =>{
    render(<ScoresGrid opened={opened} creds={creds} onClose={onClose} />)
  });

  expect(screen.queryByText(/Scores Listing/)).toBeInTheDocument();
  expect(screen.queryByText(/Add Score/)).toBeInTheDocument();
  expect(await screen.findByText(/Q2 10:30/)).toBeInTheDocument();
});

test('when opened true, creds defined fetches data, create new score', async () => {
  const opened = true
  const creds = "blah"
  const onClose = jest.fn();

  fetch.mockResolvedValueOnce({ok: true, json: () => {
    return [
      {
        "id": 1,
        "gameNum": 1,
        "quarter": 3,
        "minutesRemaining": 10,
        "secondsRemaining": 30,
        "points": 6
      }
    ]
  }});
  fetch.mockResolvedValueOnce({ok: true, json: () => {
    return [
      {
        "gameNum": 1,
        "opponent": "Opponent",
        "opponentLogo": "https://google.com",
        "won": null,
        "date": "2023-08-10T19:00:00.000Z"
      }
    ]
  }});

  await act(async () =>{
    render(<ScoresGrid opened={opened} creds={creds} onClose={onClose} />)
  });

  expect(screen.queryByText(/Scores Listing/)).toBeInTheDocument();
  expect(screen.queryByText(/Add Score/)).toBeInTheDocument();
  expect(await screen.findByText(/Game 1/)).toBeInTheDocument();
  const addButton = await screen.findByText(/Add Score/);

  act(() => {
    userEvent.click(addButton);
    jest.advanceTimersByTime(50);
  })

  expect(mockScoreForm).toHaveBeenCalledTimes(3); //original render, after click, after 50 ms
  expect(mockScoreForm.mock.calls[2][0]['opened']).toBe(true);
  act(() => {
    mockScoreForm.mock.calls[2][0]['onClose'](true, "success");
  })
  expect(mockScoreForm).toHaveBeenCalledTimes(4);
});

test('when opened true, creds defined fetches data, edit existing score', async () => {
  const opened = true
  const creds = "blah"
  const onClose = jest.fn();

  fetch.mockResolvedValueOnce({ok: true, json: () => {
    return [
      {
        "id": 1,
        "gameNum": 1,
        "quarter": 3,
        "minutesRemaining": 10,
        "secondsRemaining": 30,
        "points": 7
      }
    ]
  }});
  fetch.mockResolvedValueOnce({ok: true, json: () => {
    return [
      {
        "gameNum": 1,
        "opponent": "Opponent",
        "opponentLogo": "https://google.com",
        "won": null,
        "date": "2023-08-10T19:00:00.000Z"
      }
    ]
  }});

  await act(async () =>{
    render(<ScoresGrid opened={opened} creds={creds} onClose={onClose} />)
  });

  expect(screen.queryByText(/Scores Listing/)).toBeInTheDocument();
  expect(screen.queryByText(/Add Score/)).toBeInTheDocument();
  expect(await screen.findByText(/Game 1/)).toBeInTheDocument();
  const editButton = await screen.findByTestId(/EditIcon/);

  act(() => {
    userEvent.click(editButton);
    jest.advanceTimersByTime(50);
  })

  expect(mockScoreForm).toHaveBeenCalledTimes(3); //original render, after click, after 50 ms
  expect(mockScoreForm.mock.calls[2][0]['opened']).toBe(true);
  act(() => {
    mockScoreForm.mock.calls[2][0]['onClose']();
  })
  expect(mockScoreForm).toHaveBeenCalledTimes(4);
});