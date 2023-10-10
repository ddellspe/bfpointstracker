package live.bfpointstracker.app.service

import live.bfpointstracker.app.model.Score
import live.bfpointstracker.app.repository.GameRepository
import live.bfpointstracker.app.repository.ScoreRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ScoreService(var scoreRepository: ScoreRepository, var gameRepository: GameRepository) {
  fun createScore(score: Score): Score {
    if (score.id != 0L) {
      val currentScore: Score? = scoreRepository.findByIdOrNull(score.id)
      if (currentScore != null) {
        throw IllegalArgumentException(
          "Score with id=${score.id} already exists, please update instead."
        )
      }
    }
    gameRepository.findByIdOrNull(score.gameNum)
      ?: throw IllegalArgumentException(
        "Game with gameNum=${score.gameNum} does not exist in the database, " +
          "please be sure to add the game first."
      )
    validateScore(score)
    return scoreRepository.save(score)
  }

  fun updateScore(score: Score): Score {
    if (score.id == 0L) {
      throw IllegalArgumentException("No score id specified, please create instead.")
    }
    scoreRepository.findByIdOrNull(score.id)
      ?: throw IllegalArgumentException(
        "Score with id=${score.id} does not exist, please create instead."
      )
    gameRepository.findByIdOrNull(score.gameNum)
      ?: throw IllegalArgumentException(
        "Game with gameNum=${score.gameNum} does not exist in the database, " +
          "please be sure to add the game first."
      )
    validateScore(score)
    return scoreRepository.save(score)
  }

  private fun validateScore(score: Score) {
    if (score.minutesRemaining > 14 || score.minutesRemaining < 0) {
      throw IllegalArgumentException(
        "Game with gameNum=${score.gameNum} has an invalid number of minutes remaining: " +
          "${score.minutesRemaining} must be between 0 and 14."
      )
    }
    if (score.secondsRemaining > 59 || score.secondsRemaining < 0) {
      throw IllegalArgumentException(
        "Game with gameNum=${score.gameNum} has an invalid number of seconds remaining: " +
          "${score.secondsRemaining} must be between 0 and 59."
      )
    }
    if (score.quarter > 4 || score.quarter < 1) {
      throw IllegalArgumentException(
        "Game with gameNum=${score.gameNum} has an invalid quarter: ${score.quarter} must be " +
          "between 1 and 4."
      )
    }
  }

  fun getScore(id: Long): Score {
    return scoreRepository.findByIdOrNull(id)
      ?: throw IllegalArgumentException("Score with id=${id} does not exist.")
  }

  fun getAllScores(): List<Score> {
    return scoreRepository.findAll()
  }
}
