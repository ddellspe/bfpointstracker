package live.bfpointstracker.app.model

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class ScoreTest {
  @Test
  fun dumbCoverageTests() {
    val score = Score()
    score.id = 1L
    score.quarter = 1
    score.minutesRemaining = 15
    score.secondsRemaining = 0
    score.points = 7
    score.gameNum = 1L

    val expected = Score(1L, 1, 15, 0, 7, 1L)
    assertEquals(expected, score)
    assertEquals(expected.id, score.id)
    assertEquals(expected.quarter, score.quarter)
    assertEquals(expected.minutesRemaining, score.minutesRemaining)
    assertEquals(expected.secondsRemaining, score.secondsRemaining)
    assertEquals(expected.points, score.points)
    assertEquals(expected.gameNum, score.gameNum)
  }
}
