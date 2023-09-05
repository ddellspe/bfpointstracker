package live.bfpointstracker.app.service

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import live.bfpointstracker.app.model.Score
import live.bfpointstracker.app.repository.ScoreRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.data.repository.findByIdOrNull

class ScoreServiceTest {
  private val scoreRepository: ScoreRepository = mockk()
  private val scoreService = ScoreService(scoreRepository)
  private val score: Score = mockk()

  @Test
  fun whenGetPoint_thenReturnPoint() {
    every { scoreRepository.findByIdOrNull(1L) } returns score

    val result = scoreService.getScore(1L)

    verify(exactly = 1) { scoreRepository.findByIdOrNull(1L) }
    assertEquals(score, result)
  }
}
