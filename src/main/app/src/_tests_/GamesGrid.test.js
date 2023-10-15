import { render, screen, fireEvent, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';
import GamesGrid from '../components/GamesGrid';

beforeEach(() => {
  fetch.resetMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const mockGameForm = jest.fn();

jest.mock("../components/GameForm", () => (props) => {
  mockGameForm(props);
  return <div>game form</div>;
});

test('when opened false no display', () => {
  const opened = false
  const creds = undefined
  const onClose = jest.fn();

  render(<GamesGrid opened={opened} creds={creds} onClose={onClose} />)

  expect(screen.queryByText(/Games Listing/)).not.toBeInTheDocument();
});

test('when opened true, creds undefined shows title, no buttons', () => {
  const opened = true
  const creds = undefined
  const onClose = jest.fn();

  render(<GamesGrid opened={opened} creds={creds} onClose={onClose} />)

  expect(screen.queryByText(/Games Listing/)).toBeInTheDocument();
  expect(screen.queryByText(/Add Game/)).not.toBeInTheDocument();
});

test('when opened true, creds defined fetches data', async () => {
  const opened = true
  const creds = "blah"
  const onClose = jest.fn();

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
    render(<GamesGrid opened={opened} creds={creds} onClose={onClose} />)
  });

  expect(screen.queryByText(/Games Listing/)).toBeInTheDocument();
  expect(screen.queryByText(/Add Game/)).toBeInTheDocument();
  expect(await screen.findByText(/Opponent/)).toBeInTheDocument();
});

test('when opened true, creds defined fetches data, create new game', async () => {
  const opened = true
  const creds = "blah"
  const onClose = jest.fn();

  fetch.mockResolvedValueOnce({ok: true, json: () => {
    return [
      {
        "gameNum": 1,
        "opponent": "Opponent",
        "opponentLogo": "https://google.com",
        "won": false,
        "date": "2023-08-10T19:00:00.000Z"
      }
    ]
  }});

  await act(async () => {
    render(<GamesGrid opened={opened} creds={creds} onClose={onClose} />)
  });

  expect(screen.queryByText(/Games Listing/)).toBeInTheDocument();
  expect(screen.queryByText(/Add Game/)).toBeInTheDocument();
  expect(await screen.findByText(/Opponent/)).toBeInTheDocument();
  const addButton = await screen.findByText(/Add Game/);

  act(() => {
    userEvent.click(addButton);
    jest.advanceTimersByTime(50);
  })

  expect(mockGameForm).toHaveBeenCalledTimes(3); //original render, after click, after 50 ms
  expect(mockGameForm.mock.calls[2][0]['opened']).toBe(true);
  act(() => {
    mockGameForm.mock.calls[2][0]['onClose'](true, "success");
  })
  expect(mockGameForm).toHaveBeenCalledTimes(4);
});

test('when opened true, creds defined fetches data, edit existing game', async () => {
  const opened = true
  const creds = "blah"
  const onClose = jest.fn();

  fetch.mockResolvedValueOnce({ok: true, json: () => {
    return [
      {
        "gameNum": 1,
        "opponent": "Opponent",
        "opponentLogo": "https://google.com",
        "won": true,
        "date": "2023-08-10T19:00:00.000Z"
      }
    ]
  }});

  await act(async () => {
    render(<GamesGrid opened={opened} creds={creds} onClose={onClose} />)
  });

  expect(screen.queryByText(/Games Listing/)).toBeInTheDocument();
  expect(screen.queryByText(/Add Game/)).toBeInTheDocument();
  expect(await screen.findByText(/Opponent/)).toBeInTheDocument();
  const editButton = await screen.findByTestId(/EditIcon/);

  act(() => {
    userEvent.click(editButton);
    jest.advanceTimersByTime(50);
  })

  expect(mockGameForm).toHaveBeenCalledTimes(3); //original render, after click, after 50 ms
  expect(mockGameForm.mock.calls[2][0]['opened']).toBe(true);
  act(() => {
    mockGameForm.mock.calls[2][0]['onClose']();
  })
  expect(mockGameForm).toHaveBeenCalledTimes(4);
});