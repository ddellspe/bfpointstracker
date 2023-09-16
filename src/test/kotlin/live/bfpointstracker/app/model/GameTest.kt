package live.bfpointstracker.app.model

import java.time.OffsetDateTime
import java.time.ZoneOffset
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class GameTest {
  @Test
  fun dumbCoverageTests() {
    val game = Game()
    game.gameNum = 1L
    game.date = OffsetDateTime.of(2023, 8, 1, 12, 0, 0, 0, ZoneOffset.UTC)
    game.opponent = "Opponent"
    game.opponentLogo = "https://bfpointstracker.live"
    game.won = true

    val expected =
      Game(
        1L,
        OffsetDateTime.of(2023, 8, 1, 12, 0, 0, 0, ZoneOffset.UTC),
        "Opponent",
        "https://bfpointstracker.live",
        true
      )
    assertEquals(expected, game)
    assertEquals(expected.gameNum, game.gameNum)
    assertEquals(expected.date, game.date)
    assertEquals(expected.opponent, game.opponent)
    assertEquals(expected.opponentLogo, game.opponentLogo)
    assertEquals(expected.won, game.won)
  }
}
