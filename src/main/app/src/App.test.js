import { render, screen } from '@testing-library/react';
import App from './App';

const mockStatsSection = jest.fn();
const mockAdminSection = jest.fn();

jest.mock("./components/StatsSection", () => ()  => {
  mockStatsSection();
  return <div>stats section</div>;
});

jest.mock("./components/AdminSection", () => ()  => {
  mockAdminSection();
  return <div>admin section</div>;
});

test('renders title on page', () => {
  render(<App />);
  expect(screen.getByText(/Brian Ferentz Point Tracker/i)).toBeInTheDocument();
  expect(mockStatsSection).toHaveBeenCalled();
  expect(mockAdminSection).toHaveBeenCalled();
});
