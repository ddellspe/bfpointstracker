import '@testing-library/jest-dom';

require('jest-fetch-mock').enableMocks();

jest.mock('react-chartjs-2', () => ({
  Scatter: () => null
}))