import { render, screen, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';
import GameForm from './GameForm';

beforeEach(() => {
  fetch.resetMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const onClose = jest.fn();
const DEFAULT_GAME = {
  "gameNum": 0,
  "opponent": "",
  "opponentLogo": "",
  "date": "2023-08-10T20:00:00.000Z",
  "won": null
};
const UPDATE_GAME = {
  "gameNum": 1,
  "opponent": "Someone",
  "opponentLogo": "https://google.com",
  "date": "2023-09-10T20:00:00.000Z",
  "won": true
};

test('when opened, dialog shows', () => {
  const opened = true
  const creds = "creds"
  const game = DEFAULT_GAME

  render(<GameForm opened={opened} creds={creds} onClose={onClose} game={game} />)

  expect(screen.getByText(/Game/)).toBeInTheDocument();
});

test('when opened is false, dialog shows', () => {
  const opened = false
  const creds = "creds"
  const game = DEFAULT_GAME

  render(<GameForm opened={opened} creds={creds} onClose={onClose} game={game} />)

  expect(screen.queryByText(/Game/)).not.toBeInTheDocument();
});

test('when selecting a won status, data is updated', async () => {
  const opened = true
  const creds = "creds"
  const game = DEFAULT_GAME

  render(<GameForm opened={opened} creds={creds} onClose={onClose} game={game} />)

  expect(await screen.findByLabelText(/Not Complete/)).toBeInTheDocument();

  const wonEl = await screen.findByLabelText(/Not Complete/);

  expect(wonEl).toBeInTheDocument();
  act(() => {
    userEvent.click(wonEl);
  })
  const optionsPopupEl = await screen.findByRole("listbox");

  act(() => {
    userEvent.click(within(optionsPopupEl).getByText(/Won/));
  })
  expect(await screen.findByLabelText(/Won/)).toBeInTheDocument();
});

test('when updating date, data is updated', async () => {
  const opened = true
  const creds = "creds"
  const game = DEFAULT_GAME

  render(<GameForm opened={opened} creds={creds} onClose={onClose} game={game} />)

  const dateEl = await screen.findByLabelText(/Date/);

  expect(dateEl).toBeInTheDocument();
  expect(dateEl.value).toContain("08/10/2023");
  act(() => {
    userEvent.click(dateEl);
  });
  const datePicker = await screen.findByRole("dialog");

  act(() => {
    userEvent.click(within(datePicker).getByText(/31/));
    userEvent.click(within(datePicker).getByText(/OK/));
  })
  expect(await screen.findByLabelText(/Date/)).toBeInTheDocument();

  const dateElement = await screen.findByLabelText(/Date/);
  expect(dateEl.value).toContain("08/31/2023");
});

test('when submitting a new score, test success', async () => {
  const opened = true
  const creds = "creds"
  const game = DEFAULT_GAME
  fetch.mockResolvedValueOnce({ok: false, json: () => {return {errors: {errorMessage: "Error Message"}}}});

  render(<GameForm opened={opened} creds={creds} onClose={onClose} game={game} />)

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

test('when submitting an updated score, test success', async () => {
  const opened = true
  const creds = "creds"
  const game = UPDATE_GAME
  fetch.mockResolvedValueOnce({ok: true});

  render(<GameForm opened={opened} creds={creds} onClose={onClose} game={game} />)

  const submitButton = await screen.findByText(/Update/);
  expect(submitButton).toBeInTheDocument();

  act(() => {
    userEvent.click(submitButton);
  });
});

test('when submitting a new score, test success', async () => {
  const opened = true
  const creds = "creds"
  const game = DEFAULT_GAME
  fetch.mockResolvedValueOnce({ok: true});

  render(<GameForm opened={opened} creds={creds} onClose={onClose} game={game} />)

  const submitButton = await screen.findByText(/Create/);
  expect(submitButton).toBeInTheDocument();

  act(() => {
    userEvent.click(submitButton);
  });
});