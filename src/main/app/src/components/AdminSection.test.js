import { render, screen, fireEvent, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';
import AdminSection from './AdminSection';

beforeEach(() => {
  fetch.resetMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const mockScoresGrid = jest.fn();
const mockGamesGrid = jest.fn();
const mockLoginForm = jest.fn();

jest.mock("./GamesGrid", () => (props) => {
  mockGamesGrid(props);
  return <div>games grid</div>;
});

jest.mock("./ScoresGrid", () => (props) => {
  mockScoresGrid(props);
  return <div>scores grid</div>;
});

jest.mock("./LoginForm", ()  => (props) => {
  mockLoginForm(props);
  return <div>login form</div>;
})

test('when sessionStorage missing, login shows only', () => {
  render(<AdminSection />)

  expect(screen.getByTestId("LoginTwoToneIcon")).toBeInTheDocument();
});

test('when sessionStorage missing, login is clicked, login form shows', async () => {
  render(<AdminSection />)

  const loginButton = await screen.getByTestId("LoginTwoToneIcon");
  expect(loginButton).toBeInTheDocument();
  act(() => {
    userEvent.click(loginButton);
  });

  expect(await screen.getByText(/login form/)).toBeInTheDocument();
  expect(mockLoginForm).toHaveBeenCalledTimes(2);
  expect(mockLoginForm.mock.calls[1][0]['opened']).toBe(true);
  await act(async () => {
    sessionStorage.setItem('auth', 'blah');
    mockLoginForm.mock.calls[1][0]['onClose']();
  })
  expect(await screen.getByTestId("GamesTwoToneIcon")).toBeVisible();
});

test('when sessionStorage auth does not work, error message shows and login icon returns', async () => {
  const getItemSpy = jest.spyOn(Object.getPrototypeOf(sessionStorage), 'getItem');
  const removeItemSpy = jest.spyOn(Object.getPrototypeOf(sessionStorage), 'removeItem');

  sessionStorage.setItem('auth', 'blah');
  fetch.mockResolvedValueOnce({ok: false});

  await act(async () =>{
    render(<AdminSection />);
  });
  expect(await screen.getByText(/Error on login/)).toBeVisible();
  act(() => {
    jest.advanceTimersByTime(5000);
  })
  expect(await screen.getByText(/Error on login/)).not.toBeVisible();

  expect(getItemSpy).toHaveBeenCalledWith('auth');
  expect(removeItemSpy).toHaveBeenCalledWith('auth');
  expect(await screen.getByTestId("LoginTwoToneIcon")).toBeInTheDocument();
});

test('when sessionStorage auth works, speed dial present', async () => {
  const getItemSpy = jest.spyOn(Object.getPrototypeOf(sessionStorage), 'getItem');

  sessionStorage.setItem('auth', 'blah');
  fetch.mockResolvedValueOnce({ok: true});

  await act(async () =>{
    render(<AdminSection />);
  });

  expect(getItemSpy).toHaveBeenCalledWith('auth');
  expect(await screen.getByTestId("GamesTwoToneIcon")).toBeInTheDocument();
});

test('when sessionStorage auth works, speed dial clicked, logout button visible', async () => {
  const getItemSpy = jest.spyOn(Object.getPrototypeOf(sessionStorage), 'getItem');

  sessionStorage.setItem('auth', 'blah');
  fetch.mockResolvedValueOnce({ok: true});

  await act(async () =>{
    render(<AdminSection />);
  });

  expect(getItemSpy).toHaveBeenCalledWith('auth');
  const menuButton = await screen.getByTestId("GamesTwoToneIcon");
  act(() => {
    userEvent.click(menuButton);
  });

  expect(await screen.getByTestId("LogoutTwoToneIcon")).toBeVisible();
});

test('when sessionStorage auth works, speed dial clicked, close clicked', async () => {
  const getItemSpy = jest.spyOn(Object.getPrototypeOf(sessionStorage), 'getItem');

  sessionStorage.setItem('auth', 'blah');
  fetch.mockResolvedValueOnce({ok: true});

  await act(async () =>{
    render(<AdminSection />);
  });

  expect(getItemSpy).toHaveBeenCalledWith('auth');
  const menuButton = await screen.getByTestId("GamesTwoToneIcon");
  act(() => {
    userEvent.click(menuButton);
  });
  const closeIcon = await screen.getByTestId("CloseIcon");
  expect(closeIcon).toBeVisible();
  act(() => {
    userEvent.click(closeIcon);
  });
  expect(await screen.getByTestId("GamesTwoToneIcon")).toBeVisible();
});

test('when sessionStorage auth works, speed dial clicked, logout clicked', async () => {
  const getItemSpy = jest.spyOn(Object.getPrototypeOf(sessionStorage), 'getItem');

  sessionStorage.setItem('auth', 'blah');
  fetch.mockResolvedValueOnce({ok: true});

  await act(async () =>{
    render(<AdminSection />);
  });

  expect(getItemSpy).toHaveBeenCalledWith('auth');
  const menuButton = await screen.getByTestId("GamesTwoToneIcon");
  act(() => {
    userEvent.click(menuButton);
  });

  const logoutIcon = await screen.getByTestId("LogoutTwoToneIcon");
  expect(logoutIcon).toBeVisible();
  act(() => {
    userEvent.click(logoutIcon);
  });

  expect(screen.getByTestId("LoginTwoToneIcon")).toBeInTheDocument();
});

test('when sessionStorage auth works, speed dial clicked, scores clicked, callback called', async () => {
  const getItemSpy = jest.spyOn(Object.getPrototypeOf(sessionStorage), 'getItem');

  sessionStorage.setItem('auth', 'blah');
  fetch.mockResolvedValueOnce({ok: true});

  await act(async () =>{
    render(<AdminSection />);
  });

  expect(getItemSpy).toHaveBeenCalledWith('auth');
  const menuButton = await screen.getByTestId("GamesTwoToneIcon");
  act(() => {
    userEvent.click(menuButton);
  });

  const scoresIcon = await screen.getByTestId("ScoreboardTwoToneIcon");
  expect(scoresIcon).toBeVisible();
  act(() => {
    userEvent.click(scoresIcon);
  });

  expect(await screen.getByText(/scores grid/)).toBeInTheDocument();
  expect(mockScoresGrid).toHaveBeenCalledTimes(3);
  expect(mockScoresGrid.mock.calls[2][0]['opened']).toBe(true);
  act(() => {
    mockGamesGrid.mock.calls[2][0]['onClose']();
  })
  expect(await screen.getByTestId("GamesTwoToneIcon")).toBeVisible();
});

test('when sessionStorage auth works, speed dial clicked, scores clicked, callback called with message', async () => {
  const getItemSpy = jest.spyOn(Object.getPrototypeOf(sessionStorage), 'getItem');

  sessionStorage.setItem('auth', 'blah');
  fetch.mockResolvedValueOnce({ok: true});

  await act(async () =>{
    render(<AdminSection />);
  });

  expect(getItemSpy).toHaveBeenCalledWith('auth');
  const menuButton = await screen.getByTestId("GamesTwoToneIcon");
  act(() => {
    userEvent.click(menuButton);
  });

  const scoresIcon = await screen.getByTestId("ScoreboardTwoToneIcon");
  expect(scoresIcon).toBeVisible();
  act(() => {
    userEvent.click(scoresIcon);
  });

  expect(await screen.getByText(/scores grid/)).toBeInTheDocument();
  expect(mockScoresGrid).toHaveBeenCalledTimes(3);
  expect(mockScoresGrid.mock.calls[2][0]['opened']).toBe(true);
  act(() => {
    mockGamesGrid.mock.calls[2][0]['onClose'](true, "success");
  })
  expect(await screen.getByText(/success/)).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(6000);
  })
  expect(await screen.queryByText(/success/)).not.toBeInTheDocument();
  expect(await screen.getByTestId("GamesTwoToneIcon")).toBeVisible();
});

test('when sessionStorage auth works, speed dial clicked, games clicked, callback called', async () => {
  const getItemSpy = jest.spyOn(Object.getPrototypeOf(sessionStorage), 'getItem');

  sessionStorage.setItem('auth', 'blah');
  fetch.mockResolvedValueOnce({ok: true});

  await act(async () =>{
    render(<AdminSection />);
  });

  expect(getItemSpy).toHaveBeenCalledWith('auth');
  const menuButton = await screen.getByTestId("GamesTwoToneIcon");
  act(() => {
    userEvent.click(menuButton);
  });

  const gamesIcon = await screen.getByTestId("SportsFootballTwoToneIcon");
  expect(gamesIcon).toBeVisible();
  act(() => {
    userEvent.click(gamesIcon);
  });

  expect(await screen.getByText(/games grid/)).toBeInTheDocument();
  expect(mockGamesGrid).toHaveBeenCalledTimes(3);
  expect(mockGamesGrid.mock.calls[2][0]['opened']).toBe(true);
  act(() => {
    mockGamesGrid.mock.calls[2][0]['onClose']();
  })
  expect(await screen.getByTestId("GamesTwoToneIcon")).toBeVisible();
});

test('when sessionStorage auth works, speed dial clicked, games clicked, callback called with no success', async () => {
  const getItemSpy = jest.spyOn(Object.getPrototypeOf(sessionStorage), 'getItem');

  sessionStorage.setItem('auth', 'blah');
  fetch.mockResolvedValueOnce({ok: true});

  await act(async () =>{
    render(<AdminSection />);
  });

  expect(getItemSpy).toHaveBeenCalledWith('auth');
  const menuButton = await screen.getByTestId("GamesTwoToneIcon");
  act(() => {
    userEvent.click(menuButton);
  });

  const gamesIcon = await screen.getByTestId("SportsFootballTwoToneIcon");
  expect(gamesIcon).toBeVisible();
  act(() => {
    userEvent.click(gamesIcon);
  });

  expect(await screen.getByText(/games grid/)).toBeInTheDocument();
  expect(mockGamesGrid).toHaveBeenCalledTimes(3);
  expect(mockGamesGrid.mock.calls[2][0]['opened']).toBe(true);
  act(() => {
    mockGamesGrid.mock.calls[2][0]['onClose'](false);
  })
  expect(await screen.queryByText(/success/)).not.toBeInTheDocument();
  expect(await screen.getByTestId("GamesTwoToneIcon")).toBeVisible();
});