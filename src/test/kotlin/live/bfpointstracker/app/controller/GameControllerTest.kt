package live.bfpointstracker.app.controller

import io.mockk.every
import io.mockk.mockk
import live.bfpointstracker.app.model.Game
import live.bfpointstracker.app.model.GameWithPossibleError
import live.bfpointstracker.app.service.GameService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

class GameControllerTest {
  private val game: Game = mockk()
  private val gameService: GameService = mockk()
  private val gameController = GameController(gameService)

  @Test
  fun dumbCoverageTests() {
    gameController.gameService = gameService
  }

  @Test
  fun whenCreateGame_throwsException_thenShowError() {
    every { gameService.createGame(game) } throws IllegalArgumentException("error message")

    val result: ResponseEntity<GameWithPossibleError> = gameController.addGame(game)

    val expected =
      GameWithPossibleError(game, mapOf("error" to true, "errorMessage" to "error message"))

    assertNotNull(result.body)
    assertEquals(HttpStatus.BAD_REQUEST, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenCreateGame_succeeds_thenShowNoError() {
    every { gameService.createGame(game) } returns game

    val result: ResponseEntity<GameWithPossibleError> = gameController.addGame(game)

    val expected = GameWithPossibleError(game, null)

    assertNotNull(result.body)
    assertEquals(HttpStatus.OK, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenUpdateGame_throwsException_thenShowError() {
    every { gameService.updateGame(game) } throws IllegalArgumentException("error message")

    val result: ResponseEntity<GameWithPossibleError> = gameController.updateGame(game)

    val expected =
      GameWithPossibleError(game, mapOf("error" to true, "errorMessage" to "error message"))

    assertNotNull(result.body)
    assertEquals(HttpStatus.BAD_REQUEST, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenUpdateGame_succeeds_thenShowNoError() {
    every { gameService.updateGame(game) } returns game

    val result: ResponseEntity<GameWithPossibleError> = gameController.updateGame(game)

    val expected = GameWithPossibleError(game, null)

    assertNotNull(result.body)
    assertEquals(HttpStatus.OK, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenGetGame_throwsException_thenShowError() {
    every { gameService.getGame(1L) } throws IllegalArgumentException("error message")

    val result: ResponseEntity<GameWithPossibleError> = gameController.getGame(1L)

    val expected =
      GameWithPossibleError(null, mapOf("error" to true, "errorMessage" to "error message"))

    assertNotNull(result.body)
    assertEquals(HttpStatus.BAD_REQUEST, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenGetGame_succeeds_thenShowNoError() {
    every { gameService.getGame(1L) } returns game

    val result: ResponseEntity<GameWithPossibleError> = gameController.getGame(1L)

    val expected = GameWithPossibleError(game, null)

    assertNotNull(result.body)
    assertEquals(HttpStatus.OK, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenGetGames_hasEmptyList_thenReturnEmptyList() {
    every { gameService.getAllGames() } returns emptyList()

    val result: ResponseEntity<List<Game>> = gameController.getGames()

    val expected = emptyList<List<Game>>()

    assertNotNull(result.body)
    assertEquals(HttpStatus.OK, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenGetGames_hasGame_thenListOfGame() {
    every { gameService.getAllGames() } returns listOf(game)

    val result: ResponseEntity<List<Game>> = gameController.getGames()

    val expected = listOf(game)

    assertNotNull(result.body)
    assertEquals(HttpStatus.OK, result.statusCode)
    assertEquals(expected, result.body)
  }
}
