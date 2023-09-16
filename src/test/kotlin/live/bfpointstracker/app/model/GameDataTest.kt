package live.bfpointstracker.app.model

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class GameDataTest {
  @Test
  fun dumbCoverageTests() {
    val game = Game()
    val score = Score()
    val gameData = GameData()
    gameData.games = listOf(game)
    gameData.scores = listOf(score)

    val expected = GameData(listOf(game), listOf(score))

    assertEquals(expected, gameData)
    assertEquals(expected.games, gameData.games)
    assertEquals(expected.scores, gameData.scores)
  }
}
