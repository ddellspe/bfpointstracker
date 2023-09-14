package live.bfpointstracker.app.service

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import live.bfpointstracker.app.model.Game
import live.bfpointstracker.app.repository.GameRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.data.repository.findByIdOrNull

class GameServiceTest {
  private val gameRepository: GameRepository = mockk()
  private val gameService = GameService(gameRepository)
  private val game: Game = mockk()

  @Test
  fun dumbCoverageTests() {
    gameService.gameRepository = gameRepository
  }

  @Test
  fun whenGetGame_hasGame_thenReturnGame() {
    every { gameRepository.findByIdOrNull(1L) } returns game

    val result = gameService.getGame(1L)

    verify(exactly = 1) { gameRepository.findByIdOrNull(1L) }
    assertEquals(game, result)
  }

  @Test
  fun whenGetGame_hasNoGame_thenThrowException() {
    every { gameRepository.findByIdOrNull(1L) } returns null

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { gameService.getGame(1L) }

    verify(exactly = 1) { gameRepository.findByIdOrNull(1L) }
    assertEquals("Game with gameNum=1 does not exist.", exception.message)
  }

  @Test
  fun whenGetAllGames_hasNoGames_thenExpectEmptyList() {
    every { gameRepository.findAll() } returns emptyList()

    val result: List<Game> = gameService.getAllGames()

    assertEquals(emptyList<Game>(), result)
  }

  @Test
  fun whenGetAllGames_hasGames_thenExpectEmptyList() {
    every { gameRepository.findAll() } returns listOf(game)

    val result: List<Game> = gameService.getAllGames()

    assertEquals(listOf(game), result)
  }

  @Test
  fun whenCreateGame_hasNoGameNum_thenThrowException() {
    every { game.gameNum } returns 0L

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { gameService.createGame(game) }

    verify(exactly = 1) { game.gameNum }
    assertEquals("Game number must be a positive integer.", exception.message)
  }

  @Test
  fun whenCreateGame_hasExistingGame_thenThrowException() {
    every { game.gameNum } returns 1L
    every { gameRepository.findByIdOrNull(1L) } returns game

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { gameService.createGame(game) }

    verify(exactly = 3) { game.gameNum }
    verify(exactly = 1) { gameRepository.findByIdOrNull(1L) }
    assertEquals("Game with gameNum=1 already exists, please use update.", exception.message)
  }

  @Test
  fun whenCreateGame_hasNoExistingGame_thenReturnGame() {
    every { game.gameNum } returns 1L
    every { gameRepository.findByIdOrNull(1L) } returns null
    every { gameRepository.save(game) } returns game

    val result: Game = gameService.createGame(game)

    verify(exactly = 2) { game.gameNum }
    verify(exactly = 1) { gameRepository.findByIdOrNull(1L) }
    verify(exactly = 1) { gameRepository.save(game) }
    assertEquals(game, result)
  }

  @Test
  fun whenUpdateGame_hasNoGameNum_thenThrowException() {
    every { game.gameNum } returns 0L

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { gameService.updateGame(game) }

    verify(exactly = 1) { game.gameNum }
    assertEquals("Game number must be a positive integer.", exception.message)
  }

  @Test
  fun whenUpdateGame_hasNoExistingGame_thenThrowException() {
    every { game.gameNum } returns 1L
    every { gameRepository.findByIdOrNull(1L) } returns null

    val exception: IllegalArgumentException =
      assertThrows<IllegalArgumentException> { gameService.updateGame(game) }

    verify(exactly = 3) { game.gameNum }
    verify(exactly = 1) { gameRepository.findByIdOrNull(1L) }
    assertEquals("Game with gameNum=1 does not exist, please use create.", exception.message)
  }

  @Test
  fun whenUpdateGame_hasExistingGame_thenReturnGame() {
    every { game.gameNum } returns 1L
    every { gameRepository.findByIdOrNull(1L) } returns game
    every { gameRepository.save(game) } returns game

    val result: Game = gameService.updateGame(game)

    verify(exactly = 2) { game.gameNum }
    verify(exactly = 1) { gameRepository.findByIdOrNull(1L) }
    verify(exactly = 1) { gameRepository.save(game) }
    assertEquals(game, result)
  }
}
