package live.bfpointstracker.app.model

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class ScoreWithPossibleErrorTest {
  @Test
  fun dumbCoverageTests() {
    val score = Score()
    val errorData = mapOf<String, Any>("error" to 10)

    val scoreWithPossibleError = ScoreWithPossibleError()
    scoreWithPossibleError.score = score
    scoreWithPossibleError.errors = errorData

    val expected = ScoreWithPossibleError(score, errorData)
    assertEquals(expected, scoreWithPossibleError)
    assertEquals(expected.score, scoreWithPossibleError.score)
    assertEquals(expected.errors, scoreWithPossibleError.errors)
  }
}
