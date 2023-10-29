import { render, screen, fireEvent, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ScoreForm from '../components/ScoreForm';

beforeEach(() => {
  fetch.resetMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const onClose = jest.fn(() => true);
const DEFAULT_SCORE =
  {
    "id": 0,
    "quarter": 1,
    "minutesRemaining": 14,
    "secondsRemaining": 59,
    "gameNum": 2,
    "points": 1
  };
const UPDATE_SCORE =
  {
    "id": 30,
    "quarter": 1,
    "minutesRemaining": 14,
    "secondsRemaining": 59,
    "gameNum": 2,
    "points": 7
  };
const GAMES_LIST =
  [
    {"gameNum": 1, "opponent": "Utah State"},
    {"gameNum": 2, "opponent": "Iowa State"},
    {"gameNum": 3, "opponent": "Western Michigan"},
    {"gameNum": 4, "opponent": "Penn State"},
    {"gameNum": 5, "opponent": "Michigan State"},
    {"gameNum": 6, "opponent": "Purdue"},
    {"gameNum": 7, "opponent": "Wisconsin"},
    {"gameNum": 8, "opponent": "Minnesota"},
    {"gameNum": 9, "opponent": "Northwestern"},
    {"gameNum": 10, "opponent": "Rutgers"},
    {"gameNum": 11, "opponent": "Illinois"},
    {"gameNum": 12, "opponent": "Nebraska"}
  ]

test('when opened, dialog shows', () => {
  const opened = true
  const creds = "creds"
  const score = DEFAULT_SCORE

  render(<ScoreForm opened={opened} creds={creds} onClose={onClose} score={score} games={GAMES_LIST} />)

  expect(screen.getByText(/Score/i)).toBeInTheDocument();
});

test('when not opened, dialog does not show', () => {
  const opened = false
  const creds = "creds"
  const score = DEFAULT_SCORE

  render(<ScoreForm opened={opened} creds={creds} onClose={onClose} score={score} games={GAMES_LIST} />)

  expect(screen.queryByText(/Score/i)).not.toBeInTheDocument();
});

test('when game number changed, onChange called', async () => {
  const opened = true
  const creds = "creds"
  const score = DEFAULT_SCORE

  render(<ScoreForm opened={opened} creds={creds} onClose={onClose} score={score} games={GAMES_LIST} />)

  expect(await screen.findByLabelText(/Game/)).toBeInTheDocument();

  const gameNumEl = await screen.findByLabelText(/Iowa State/);

  expect(gameNumEl).toBeInTheDocument();
  act(() => {
    userEvent.click(gameNumEl);
  })
  const optionsPopupEl = await screen.findByRole("listbox");

  act(() => {
    userEvent.click(within(optionsPopupEl).getByText(/Minnesota/));
  })
  expect(await screen.findByLabelText(/Minnesota/)).toBeInTheDocument();
});

test('when quarter changed, onChange called', async () => {
  const opened = true
  const creds = "creds"
  const score = DEFAULT_SCORE

  render(<ScoreForm opened={opened} creds={creds} onClose={onClose} score={score} games={GAMES_LIST} />)

  expect(await screen.findByLabelText(/Quarter/)).toBeInTheDocument();

  const quarterEl = await screen.findByLabelText(/1/);

  expect(quarterEl).toBeInTheDocument();
  act(() => {
    userEvent.click(quarterEl);
  })
  const optionsPopupEl = await screen.findByRole("listbox");

  act(() => {
    userEvent.click(within(optionsPopupEl).getByText(/4/));
  })
  expect(await screen.findByLabelText(/4/)).toBeInTheDocument();
});

test('when points changed, onChange called', async () => {
  const opened = true
  const creds = "creds"
  const score = DEFAULT_SCORE

  render(<ScoreForm opened={opened} creds={creds} onClose={onClose} score={score} games={GAMES_LIST} />)

  const slider = await screen.findByRole('slider', {value: /1/});
  expect(slider).toBeInTheDocument();

  act(() => {
    fireEvent.change(slider, {target: {value: 3}});
  })

  expect(await screen.findByRole('slider', {value: /3/})).toBeInTheDocument();
});

test('when score submitted throws error, display error then hide error', async () => {
  const opened = true
  const creds = "creds"
  const score = DEFAULT_SCORE
  fetch.mockResolvedValueOnce({ok: false, json: () => {return {errors: {errorMessage: "Error Message"}}}});

  render(<ScoreForm opened={opened} creds={creds} onClose={onClose} score={score} games={GAMES_LIST} />)

  const submitButton = await screen.findByText(/Create/);
  expect(submitButton).toBeInTheDocument();

  act(() => {
    userEvent.click(submitButton);
  });

  expect(await screen.findByText(/Error Message/)).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(7000);
  })
  expect(await screen.queryByText(/Error Message/)).not.toBeInTheDocument();
});

test('when score create submitted success calls onClose', async () => {
  const opened = true
  const creds = "creds"
  const score = DEFAULT_SCORE
  fetch.mockResolvedValueOnce({ok: true});

  render(<ScoreForm opened={opened} creds={creds} onClose={onClose} score={score} games={GAMES_LIST} />)

  const submitButton = await screen.findByText(/Create/);
  expect(submitButton).toBeInTheDocument();

  act(() => {
    userEvent.click(submitButton);
  });
});

test('when score update submitted success calls onClose', async () => {
  const opened = true
  const creds = "creds"
  const score = UPDATE_SCORE
  fetch.mockResolvedValueOnce({ok: true});

  render(<ScoreForm opened={opened} creds={creds} onClose={onClose} score={score} games={GAMES_LIST} />)

  const submitButton = await screen.findByText(/Update/);
  expect(submitButton).toBeInTheDocument();

  act(() => {
    userEvent.click(submitButton);
  });
});

test('when cancel clicked onClose called', async () => {
  const opened = true
  const creds = "creds"
  const score = UPDATE_SCORE
  fetch.mockResolvedValueOnce({ok: true});

  render(<ScoreForm opened={opened} creds={creds} onClose={onClose} score={score} games={GAMES_LIST} />)

  const cancelButton = await screen.findByText(/Cancel/);
  expect(cancelButton).toBeInTheDocument();

  act(() => {
    userEvent.click(cancelButton);
  });

  expect(onClose).toHaveBeenCalled();
});