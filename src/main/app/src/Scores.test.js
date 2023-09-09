import { getTime, compareScores, processData } from './Scores';
import { Data } from './utils/Data';

test('getTime should return 0 when quarter is 1, minutes remaining is 15 and seconds remaining is 0 and game is 1', () => {
  const score = {quarter: 1, minutesRemaining: 15 , secondsRemaining: 0, gameNum: 1}
  expect(getTime(score)).toBe(0);
});

test('getTime should return 0.5 when quarter is 3, minutes remaining is 15 and seconds remaining is 0 and game is 1', () => {
  const score = {quarter: 3, minutesRemaining: 15 , secondsRemaining: 0, gameNum: 1}
  expect(getTime(score)).toBe(0.5);
});

test('getTime should return 1/36 when quarter is 1, minutes remaining is 13 and seconds remaining is 20 and game is 1', () => {
  const score = {quarter: 1, minutesRemaining: 13 , secondsRemaining: 20, gameNum: 1}
  expect(getTime(score)).toBe(1/36);
});

test('getTime should return 1/10 when quarter is 1, minutes remaining is 9 and seconds remaining is 0 and game is 1', () => {
  const score = {quarter: 1, minutesRemaining: 9 , secondsRemaining: 0, gameNum: 1}
  expect(getTime(score)).toBe(1/10);
});

test('getTime should return 1 when quarter is 4, minutes remaining is 0 and seconds remaining is 0 and game is 1', () => {
  const score = {quarter: 4, minutesRemaining: 0 , secondsRemaining: 0, gameNum: 1}
  expect(getTime(score)).toBe(1);
});

test('compareScores earlier game is less', () => {
  const score1 = {quarter: 1, minutesRemaining: 15, secondsRemaining: 0, gameNum: 1}
  const score2 = {quarter: 1, minutesRemaining: 15, secondsRemaining: 0, gameNum: 2}
  expect(compareScores(score1, score2)).toBe(-1);
  expect(compareScores(score2, score1)).toBe(1);
})

test('compareScores earlier quarter is less', () => {
  const score1 = {quarter: 1, minutesRemaining: 15, secondsRemaining: 0, gameNum: 1}
  const score2 = {quarter: 2, minutesRemaining: 15, secondsRemaining: 0, gameNum: 1}
  expect(compareScores(score1, score2)).toBe(-1);
  expect(compareScores(score2, score1)).toBe(1);
})

test('compareScores earlier minute is less', () => {
  const score1 = {quarter: 2, minutesRemaining: 15, secondsRemaining: 0, gameNum: 1}
  const score2 = {quarter: 2, minutesRemaining: 13, secondsRemaining: 0, gameNum: 1}
  expect(compareScores(score1, score2)).toBe(-1);
  expect(compareScores(score2, score1)).toBe(1);
})

test('compareScores earlier second is less', () => {
  const score1 = {quarter: 2, minutesRemaining: 13, secondsRemaining: 50, gameNum: 1}
  const score2 = {quarter: 2, minutesRemaining: 13, secondsRemaining: 30, gameNum: 1}
  expect(compareScores(score1, score2)).toBe(-1);
  expect(compareScores(score2, score1)).toBe(1);
})

test('processData with no scores returns default', () => {
  const rawData = {scores: [], games: []}
  const expectedData = Data;
  expect(processData(rawData)).toBe(expectedData);
});

test('processData has only 2 data points with 1 score when game not complete', () => {
  const rawData = {
    scores: [
      {
        quarter: 2,
        minutesRemaining: 7,
        secondsRemaining: 30,
        gameNum: 1,
        points: 7
      }
    ],
    games: [
      {
        gameNum: 1,
        won: null
      }
    ]
  }
  const expectedData = [
    {time: 0, total: 0},
    {time: 0.375, total: 7}
  ]

  const actualOutput = processData(rawData)

  expect(actualOutput.length).toBe(2)
  expect(processData(rawData)).toStrictEqual(expectedData);
});

test('processData has 4 data points with 2 scores when game won', () => {
  const rawData = {
    scores: [
      {
        quarter: 2,
        minutesRemaining: 7,
        secondsRemaining: 30,
        gameNum: 1,
        points: 7
      },
      {
        quarter: 3,
        minutesRemaining: 7,
        secondsRemaining: 30,
        gameNum: 1,
        points: 7
      }
    ],
    games: [
      {
        gameNum: 1,
        won: true
      }
    ]
  }
  const expectedData = [
    {time: 0, total: 0},
    {time: 0.375, total: 7},
    {time: 0.625, total: 14},
    {time: 1, total: 14}
  ]

  const actualOutput = processData(rawData)

  expect(actualOutput.length).toBe(4)
  expect(processData(rawData)).toStrictEqual(expectedData);
});

test('processData has 4 data points with 2 scores when two games played', () => {
  const rawData = {
    scores: [
      {
        quarter: 2,
        minutesRemaining: 7,
        secondsRemaining: 30,
        gameNum: 1,
        points: 7
      },
      {
        quarter: 3,
        minutesRemaining: 7,
        secondsRemaining: 30,
        gameNum: 2,
        points: 7
      }
    ],
    games: [
      {
        gameNum: 1,
        won: true
      },
      {
        gameNum: 2,
        won: null
      }
    ]
  }
  const expectedData = [
    {time: 0, total: 0},
    {time: 0.375, total: 7},
    {time: 1, total: 7},
    {time: 1.625, total: 14}
  ]

  const actualOutput = processData(rawData)

  expect(actualOutput.length).toBe(4)
  expect(processData(rawData)).toStrictEqual(expectedData);
});

test('processData has 4 data points with 2 scores when two games played, last score at end of game', () => {
  const rawData = {
    scores: [
      {
        quarter: 2,
        minutesRemaining: 7,
        secondsRemaining: 30,
        gameNum: 1,
        points: 7
      },
      {
        quarter: 4,
        minutesRemaining: 0,
        secondsRemaining: 0,
        gameNum: 1,
        points: 7
      },
      {
        quarter: 3,
        minutesRemaining: 7,
        secondsRemaining: 30,
        gameNum: 2,
        points: 7
      }
    ],
    games: [
      {
        gameNum: 1,
        won: true
      },
      {
        gameNum: 2,
        won: null
      }
    ]
  }
  const expectedData = [
    {time: 0, total: 0},
    {time: 0.375, total: 7},
    {time: 1, total: 14},
    {time: 1.625, total: 21}
  ]

  const actualOutput = processData(rawData)

  expect(actualOutput.length).toBe(4)
  expect(processData(rawData)).toStrictEqual(expectedData);
});

test('processData has 4 data points with 2 scores when two games played, last score just before end of game', () => {
  const rawData = {
    scores: [
      {
        quarter: 2,
        minutesRemaining: 7,
        secondsRemaining: 30,
        gameNum: 1,
        points: 7
      },
      {
        quarter: 4,
        minutesRemaining: 0,
        secondsRemaining: 30,
        gameNum: 1,
        points: 7
      },
      {
        quarter: 3,
        minutesRemaining: 7,
        secondsRemaining: 30,
        gameNum: 2,
        points: 7
      }
    ],
    games: [
      {
        gameNum: 1,
        won: true
      },
      {
        gameNum: 2,
        won: null
      }
    ]
  }
  const expectedData = [
    {time: 0, total: 0},
    {time: 0.375, total: 7},
    {time: 357/360, total: 14},
    {time: 1, total: 14},
    {time: 1.625, total: 21}
  ]

  const actualOutput = processData(rawData)

  expect(actualOutput.length).toBe(5)
  expect(processData(rawData)).toStrictEqual(expectedData);
});

test('processData has 4 data points with 2 scores when two games played, last score in last quarter minutes before end', () => {
  const rawData = {
    scores: [
      {
        quarter: 2,
        minutesRemaining: 7,
        secondsRemaining: 30,
        gameNum: 1,
        points: 7
      },
      {
        quarter: 4,
        minutesRemaining: 6,
        secondsRemaining: 0,
        gameNum: 1,
        points: 7
      },
      {
        quarter: 3,
        minutesRemaining: 7,
        secondsRemaining: 30,
        gameNum: 2,
        points: 7
      }
    ],
    games: [
      {
        gameNum: 1,
        won: true
      },
      {
        gameNum: 2,
        won: null
      }
    ]
  }
  const expectedData = [
    {time: 0, total: 0},
    {time: 0.375, total: 7},
    {time: 0.9, total: 14},
    {time: 1, total: 14},
    {time: 1.625, total: 21}
  ]

  const actualOutput = processData(rawData)

  expect(actualOutput.length).toBe(5)
  expect(processData(rawData)).toStrictEqual(expectedData);
});