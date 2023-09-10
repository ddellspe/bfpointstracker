export function compareScores(leftScore, rightScore) {
  if (leftScore.gameNum < rightScore.gameNum) {
    return -1;
  } else if (leftScore.gameNum === rightScore.gameNum) {
    if (leftScore.quarter < rightScore.quarter) {
      return -1;
    } else if (leftScore.quarter === rightScore.quarter) {
      if ((leftScore.minutesRemaining * 60 + leftScore.secondsRemaining) > (rightScore.minutesRemaining * 60 + rightScore.secondsRemaining)) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  } else {
    return 1;
  }
}

export function processGameData(rawData) {
  return {
    wins: rawData.games.filter(game => game.won === true),
    losses: rawData.games.filter(game => game.won === false),
    played: rawData.games.filter(game => game.won !== null),
    all: rawData.games
  };
}

export function processScoreData(rawData) {
  const sortedScores = rawData.scores.sort(compareScores);
  var scores = [{time: 0, total: 0}];
  var prevScore = null;
  var runningTotal = 0;
  if (sortedScores.length > 0) {
    for (let i = 0 ; i < sortedScores.length ; i++) {
      let score = sortedScores[i];
      if (prevScore != null && score.gameNum !== prevScore.gameNum) {
        if (prevScore.quarter !== 4 ||
              prevScore.minutesRemaining !== 0 ||
              prevScore.secondsRemaining !== 0) {
          scores.push({time: prevScore.gameNum, total: runningTotal});
        }
      }
      runningTotal += score.points;
      scores.push({time: getTime(score), total: runningTotal});
      prevScore = score;
    }
    if(rawData.games.filter(game => game.gameNum === prevScore.gameNum)[0].won !== null) {
      scores.push({time: prevScore.gameNum, total: runningTotal});
    }
  }
  return scores;
}

export function getTime(score) {
  var time = (score.gameNum - 1) * 3600
  time += score.quarter * 15 * 60;
  time -= (score.minutesRemaining * 60 + score.secondsRemaining);
  return time / 3600;
}