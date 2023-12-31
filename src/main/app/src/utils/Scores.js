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
  const rawScores = rawData.scores;
  const gamesPlayed = rawData.games.filter(game => game.won !== null);
  for (let i = 0 ; i < gamesPlayed.length ; i++) {
    let game = gamesPlayed[i];
    if (rawScores.filter(score => score.gameNum === game.gameNum).length === 0){
      rawScores.push({
        gameNum: game.gameNum,
        quarter: 4,
        minutesRemaining: 0,
        secondsRemaining: 0,
        points: 0
      });
    }
  }
  const sortedScores = rawScores.sort(compareScores);
  var scores = [{time: 0, total: 0}];
  var prevScore = null;
  var runningTotal = 0;
  if (sortedScores.length > 0) {
    scores.push({time:1/3600, total: 0});
    for (let i = 0 ; i < sortedScores.length ; i++) {
      let score = sortedScores[i];
      if (prevScore != null && score.gameNum !== prevScore.gameNum) {
        if (prevScore.quarter !== 4 ||
              prevScore.minutesRemaining !== 0 ||
              prevScore.secondsRemaining !== 0) {
          scores.push({time: prevScore.gameNum, total: runningTotal});
        }
        scores.push({time: ((prevScore.gameNum * 3600 + 1) / 3600), total: runningTotal});
      }
      runningTotal += score.points;
      scores.push({time: getTime(score), total: runningTotal});
      prevScore = score;
    }
    if(rawData.games.filter(game => game.gameNum === prevScore.gameNum)[0].won !== null) {
      if (prevScore.quarter !== 4 ||
            prevScore.minutesRemaining !== 0 ||
            prevScore.secondsRemaining !== 0) {
        scores.push({time: prevScore.gameNum, total: runningTotal});
      }
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