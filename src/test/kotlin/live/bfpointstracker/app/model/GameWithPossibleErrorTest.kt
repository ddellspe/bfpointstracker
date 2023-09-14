package live.bfpointstracker.app.model

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class GameWithPossibleErrorTest {
  @Test
  fun dumbCoverageTests() {
    val game = Game()
    val errorData = mapOf<String, Any>("error" to 10)

    val gameWithPossibleError = GameWithPossibleError()
    gameWithPossibleError.game = game
    gameWithPossibleError.errors = errorData

    val expected = GameWithPossibleError(game, errorData)
    assertEquals(expected, gameWithPossibleError)
    assertEquals(expected.game, gameWithPossibleError.game)
    assertEquals(expected.errors, gameWithPossibleError.errors)
  }
}
