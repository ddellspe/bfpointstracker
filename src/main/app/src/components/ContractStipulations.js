const PROGRESS_DEFAULT = "progress-bar progress-bar-striped progress-bar-animated bg-";

function ContractStipulations({gamesData, scoresData}) {
  const gamesWon = gamesData.wins.length;
  const gamesPlayed = gamesData.played.length;
  const gameWinProgress = Math.ceil(gamesWon / 7 * 100);
  const winPercentage = gamesWon / gamesPlayed;
  const gamesClass = PROGRESS_DEFAULT + (winPercentage <= 0.5 ? "warning" : "success");

  const pointsScored = scoresData.length === 0 ? 0 : scoresData[scoresData.length - 1].total;
  const pointsMadeProgress = Math.ceil(pointsScored / 300 * 100)
  const pointsAverage = pointsScored / gamesPlayed;
  const pointsScoredClass = PROGRESS_DEFAULT + (pointsAverage < 25 ? "warning" : "success");

  const pointDiff = gamesPlayed * 25 - pointsScored;
  const sign = pointDiff < 0 ? "+" : (pointDiff === 0 ? "" : "-");
  const differential = sign + Math.abs(pointDiff);

  return (
    <div className="container overflow-hidden">
      <div className="row py-2">
        <div className="col">
          <h2>Contract Stipulations</h2>
        </div>
      </div>
      <div className="row py-2">
        <div className="col">
          <h3>Required Wins ({gamesWon} of 7)</h3>
          <div className="progress">
            <div className={gamesClass} role="progressbar" style={{width: `${gameWinProgress}%`}} aria-valuenow={gamesWon} aria-valuemin="0" aria-valuemax="7">{gameWinProgress}%</div>
          </div>
        </div>
      </div>
      <div className="row py-2">
        <div className="col">
          <h3>Required Points ({pointsScored} of 300)</h3>
          <div className="progress">
            <div className={pointsScoredClass} role="progressbar" style={{width: `${pointsMadeProgress}%`}} aria-valuenow={pointsScored} aria-valuemin="0" aria-valuemax="300">{pointsMadeProgress}% ({differential})</div>
          </div>

        </div>
      </div>
    </div>
  );
}
export default ContractStipulations;