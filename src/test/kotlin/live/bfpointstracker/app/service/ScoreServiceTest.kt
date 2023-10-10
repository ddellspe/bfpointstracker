package live.bfpointstracker.app.service

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import live.bfpointstracker.app.model.Game
import live.bfpointstracker.app.model.Score
import live.bfpointstracker.app.repository.GameRepository
import live.bfpointstracker.app.repository.ScoreRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.data.repository.findByIdOrNull

class ScoreServiceTest {
  private val scoreRepository: ScoreRepository = mockk()
  private val gameRepository: GameRepository = mockk()
  private val scoreService = ScoreService(scoreRepository, gameRepository)
  private val score: Score = mockk()
  private val game: Game = mockk()

  @Test
  fun dumbCoverageTests() {
    scoreService.gameRepository = gameRepository
    scoreService.scoreRepository = scoreRepository
  }

  @Test
  fun whenGetScore_hasScore_thenReturnScore() {
    every { scoreRepository.findByIdOrNull(1L) } returns score

    val result = scoreService.getScore(1L)

    verify(exactly = 1) { scoreRepository.findByIdOrNull(1L) }
    assertEquals(score, result)
  }

  @Test
  fun whenGetScore_hasNoScore_thenExpectException() {
    every { scoreRepository.findByIdOrNull(1L) } returns null

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { scoreService.getScore(1L) }

    verify(exactly = 1) { scoreRepository.findByIdOrNull(1L) }
    assertEquals("Score with id=1 does not exist.", exception.message)
  }

  @Test
  fun whenGetAllScores_hasNoScores_thenReturnEmptyList() {
    every { scoreRepository.findAll() } returns emptyList()

    val result: List<Score> = scoreService.getAllScores()

    assertEquals(emptyList<Score>(), result)
  }

  @Test
  fun whenCreateScore_hasTooHighMinutes_thenThrowsException() {
    every { score.id } returns 0L
    every { score.gameNum } returns 2L
    every { score.minutesRemaining } returns 15
    every { gameRepository.findByIdOrNull(2L) } returns game
    every { scoreRepository.save(score) } returns score

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { scoreService.createScore(score) }

    verify(exactly = 1) { score.id }
    verify(exactly = 2) { score.gameNum }
    verify(exactly = 2) { score.minutesRemaining }
    verify(exactly = 1) { gameRepository.findByIdOrNull(2L) }

    assertEquals(
      "Game with gameNum=2 has an invalid number of minutes remaining: 15 must be " +
        "between 0 and 14.",
      exception.message
    )
  }

  @Test
  fun whenCreateScore_hasTooLowMinutes_thenThrowsException() {
    every { score.id } returns 0L
    every { score.gameNum } returns 2L
    every { score.minutesRemaining } returns -1
    every { gameRepository.findByIdOrNull(2L) } returns game
    every { scoreRepository.save(score) } returns score

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { scoreService.createScore(score) }

    verify(exactly = 1) { score.id }
    verify(exactly = 2) { score.gameNum }
    verify(exactly = 3) { score.minutesRemaining }
    verify(exactly = 1) { gameRepository.findByIdOrNull(2L) }

    assertEquals(
      "Game with gameNum=2 has an invalid number of minutes remaining: -1 must be " +
        "between 0 and 14.",
      exception.message
    )
  }

  @Test
  fun whenCreateScore_hasTooHighSeconds_thenThrowsException() {
    every { score.id } returns 0L
    every { score.gameNum } returns 2L
    every { score.minutesRemaining } returns 0
    every { score.secondsRemaining } returns 60
    every { gameRepository.findByIdOrNull(2L) } returns game
    every { scoreRepository.save(score) } returns score

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { scoreService.createScore(score) }

    verify(exactly = 1) { score.id }
    verify(exactly = 2) { score.gameNum }
    verify(exactly = 2) { score.minutesRemaining }
    verify(exactly = 2) { score.secondsRemaining }
    verify(exactly = 1) { gameRepository.findByIdOrNull(2L) }

    assertEquals(
      "Game with gameNum=2 has an invalid number of seconds remaining: 60 must be " +
        "between 0 and 59.",
      exception.message
    )
  }

  @Test
  fun whenCreateScore_hasTooLowSeconds_thenThrowsException() {
    every { score.id } returns 0L
    every { score.gameNum } returns 2L
    every { score.minutesRemaining } returns 0
    every { score.secondsRemaining } returns -1
    every { gameRepository.findByIdOrNull(2L) } returns game
    every { scoreRepository.save(score) } returns score

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { scoreService.createScore(score) }

    verify(exactly = 1) { score.id }
    verify(exactly = 2) { score.gameNum }
    verify(exactly = 2) { score.minutesRemaining }
    verify(exactly = 3) { score.secondsRemaining }
    verify(exactly = 1) { gameRepository.findByIdOrNull(2L) }

    assertEquals(
      "Game with gameNum=2 has an invalid number of seconds remaining: -1 must be " +
        "between 0 and 59.",
      exception.message
    )
  }

  @Test
  fun whenCreateScore_hasTooHighQuarter_thenThrowsException() {
    every { score.id } returns 0L
    every { score.gameNum } returns 2L
    every { score.minutesRemaining } returns 0
    every { score.secondsRemaining } returns 0
    every { score.quarter } returns 5
    every { gameRepository.findByIdOrNull(2L) } returns game
    every { scoreRepository.save(score) } returns score

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { scoreService.createScore(score) }

    verify(exactly = 1) { score.id }
    verify(exactly = 2) { score.gameNum }
    verify(exactly = 2) { score.minutesRemaining }
    verify(exactly = 2) { score.secondsRemaining }
    verify(exactly = 2) { score.quarter }
    verify(exactly = 1) { gameRepository.findByIdOrNull(2L) }

    assertEquals(
      "Game with gameNum=2 has an invalid quarter: 5 must be between 1 and 4.",
      exception.message
    )
  }

  @Test
  fun whenCreateScore_hasTooLowQuarter_thenThrowsException() {
    every { score.id } returns 0L
    every { score.gameNum } returns 2L
    every { score.minutesRemaining } returns 0
    every { score.secondsRemaining } returns 0
    every { score.quarter } returns 0
    every { gameRepository.findByIdOrNull(2L) } returns game
    every { scoreRepository.save(score) } returns score

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { scoreService.createScore(score) }

    verify(exactly = 1) { score.id }
    verify(exactly = 2) { score.gameNum }
    verify(exactly = 2) { score.minutesRemaining }
    verify(exactly = 2) { score.secondsRemaining }
    verify(exactly = 3) { score.quarter }
    verify(exactly = 1) { gameRepository.findByIdOrNull(2L) }

    assertEquals(
      "Game with gameNum=2 has an invalid quarter: 0 must be between 1 and 4.",
      exception.message
    )
  }

  @Test
  fun whenCreateScore_hasNoExistingScore_hasValidGame_thenReturnScore() {
    every { score.id } returns 0L
    every { score.gameNum } returns 2L
    every { score.minutesRemaining } returns 0
    every { score.secondsRemaining } returns 0
    every { score.quarter } returns 4
    every { gameRepository.findByIdOrNull(2L) } returns game
    every { scoreRepository.save(score) } returns score

    val result: Score = scoreService.createScore(score)

    verify(exactly = 1) { score.id }
    verify(exactly = 1) { score.gameNum }
    verify(exactly = 2) { score.minutesRemaining }
    verify(exactly = 2) { score.secondsRemaining }
    verify(exactly = 2) { score.quarter }
    verify(exactly = 1) { gameRepository.findByIdOrNull(2L) }

    assertEquals(score, result)
  }

  @Test
  fun whenCreateScore_hasNoExistingScore_withScoreId_hasValidGame_thenReturnScore() {
    every { score.id } returns 1L
    every { score.gameNum } returns 2L
    every { score.minutesRemaining } returns 0
    every { score.secondsRemaining } returns 0
    every { score.quarter } returns 4
    every { scoreRepository.findByIdOrNull(1L) } returns null
    every { gameRepository.findByIdOrNull(2L) } returns game
    every { scoreRepository.save(score) } returns score

    val result: Score = scoreService.createScore(score)

    verify(exactly = 2) { score.id }
    verify(exactly = 1) { score.gameNum }
    verify(exactly = 2) { score.minutesRemaining }
    verify(exactly = 2) { score.secondsRemaining }
    verify(exactly = 2) { score.quarter }
    verify(exactly = 1) { scoreRepository.findByIdOrNull(1L) }
    verify(exactly = 1) { gameRepository.findByIdOrNull(2L) }

    assertEquals(score, result)
  }

  @Test
  fun whenCreateScore_hasExistingScore_withScoreId_hasValidGame_thenThrowsException() {
    every { score.id } returns 1L
    every { scoreRepository.findByIdOrNull(1L) } returns score

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { scoreService.createScore(score) }

    verify(exactly = 3) { score.id }
    verify(exactly = 1) { scoreRepository.findByIdOrNull(1L) }

    assertEquals("Score with id=1 already exists, please update instead.", exception.message)
  }

  @Test
  fun whenCreateScore_hasNoExistingScore_withScoreId_hasInvalidGame_thenThrowsException() {
    every { score.id } returns 1L
    every { score.gameNum } returns 2L
    every { scoreRepository.findByIdOrNull(1L) } returns null
    every { gameRepository.findByIdOrNull(2L) } returns null

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { scoreService.createScore(score) }

    verify(exactly = 2) { score.id }
    verify(exactly = 2) { score.gameNum }
    verify(exactly = 1) { scoreRepository.findByIdOrNull(1L) }
    verify(exactly = 1) { gameRepository.findByIdOrNull(2L) }

    assertEquals(
      "Game with gameNum=2 does not exist in the database, please be sure to add the game first.",
      exception.message
    )
  }

  @Test
  fun whenUpdateScore_hasNoIDSet_thenThrowException() {
    every { score.id } returns 0L

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { scoreService.updateScore(score) }

    verify(exactly = 1) { score.id }

    assertEquals("No score id specified, please create instead.", exception.message)
  }

  @Test
  fun whenUpdateScore_hasNoExistingScore_thenThrowException() {
    every { score.id } returns 1L
    every { scoreRepository.findByIdOrNull(1L) } returns null

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { scoreService.updateScore(score) }

    verify(exactly = 3) { score.id }
    verify(exactly = 1) { scoreRepository.findByIdOrNull(1L) }

    assertEquals("Score with id=1 does not exist, please create instead.", exception.message)
  }

  @Test
  fun whenUpdateScore_hasExistingScore_noExistingGame_thenThrowException() {
    every { score.id } returns 1L
    every { score.gameNum } returns 2L
    every { scoreRepository.findByIdOrNull(1L) } returns score
    every { gameRepository.findByIdOrNull(2L) } returns null

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { scoreService.updateScore(score) }

    verify(exactly = 2) { score.id }
    verify(exactly = 2) { score.gameNum }
    verify(exactly = 1) { scoreRepository.findByIdOrNull(1L) }
    verify(exactly = 1) { gameRepository.findByIdOrNull(2L) }

    assertEquals(
      "Game with gameNum=2 does not exist in the database, please be sure to add the game first.",
      exception.message
    )
  }

  @Test
  fun whenUpdateScore_hasExistingScore_hasExistingGame_thenReturnScore() {
    every { score.id } returns 1L
    every { score.gameNum } returns 2L
    every { score.minutesRemaining } returns 0
    every { score.secondsRemaining } returns 0
    every { score.quarter } returns 4
    every { scoreRepository.findByIdOrNull(1L) } returns score
    every { gameRepository.findByIdOrNull(2L) } returns game
    every { scoreRepository.save(score) } returns score

    val result: Score = scoreService.updateScore(score)

    verify(exactly = 2) { score.id }
    verify(exactly = 1) { score.gameNum }
    verify(exactly = 2) { score.minutesRemaining }
    verify(exactly = 2) { score.secondsRemaining }
    verify(exactly = 2) { score.quarter }
    verify(exactly = 1) { scoreRepository.findByIdOrNull(1L) }
    verify(exactly = 1) { gameRepository.findByIdOrNull(2L) }
    verify(exactly = 1) { scoreRepository.save(score) }

    assertEquals(score, result)
  }
}
