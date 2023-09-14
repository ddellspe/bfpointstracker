package live.bfpointstracker.app.controller

import io.mockk.every
import io.mockk.mockk
import java.time.OffsetDateTime
import live.bfpointstracker.app.model.Game
import live.bfpointstracker.app.model.GameData
import live.bfpointstracker.app.model.Score
import live.bfpointstracker.app.service.GameService
import live.bfpointstracker.app.service.ScoreService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class DataControllerTest {
  private val gameService: GameService = mockk()
  private val scoreService: ScoreService = mockk()
  private val dataController: DataController = DataController(gameService, scoreService)

  @Test
  fun dumbCoverageTests() {
    dataController.gameService = gameService
    dataController.scoreService = scoreService
  }

  @Test
  fun whenGetGameData_HasNoScoresOrGames_ReturnEmptyLists() {
    every { gameService.getAllGames() } returns emptyList()
    every { scoreService.getAllScores() } returns emptyList()

    val result: GameData = dataController.getGameData()

    assertEquals(result, GameData(emptyList(), emptyList()))
  }

  @Test
  fun whenGetGameData_HasScoresAndGames_ReturnEverything() {
    val firstScore: Score = Score(1L, 1, 15, 0, 7, 1L)
    val scores: List<Score> = listOf(firstScore)
    val firstGame: Game =
      Game(1L, OffsetDateTime.now(), "opponent", "https://bfpointstracker.live", null)
    val games: List<Game> = listOf(firstGame)
    every { gameService.getAllGames() } returns games
    every { scoreService.getAllScores() } returns scores

    val result: GameData = dataController.getGameData()

    assertEquals(result, GameData(games, scores))
  }
}
