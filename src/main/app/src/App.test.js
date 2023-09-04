import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title on page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Brian Ferentz Point Tracker/i);
  expect(linkElement).toBeInTheDocument();
});
