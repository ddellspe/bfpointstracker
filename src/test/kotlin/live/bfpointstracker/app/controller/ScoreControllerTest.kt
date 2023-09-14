package live.bfpointstracker.app.controller

import io.mockk.every
import io.mockk.mockk
import live.bfpointstracker.app.model.Score
import live.bfpointstracker.app.model.ScoreWithPossibleError
import live.bfpointstracker.app.service.ScoreService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

class ScoreControllerTest {
  private val score: Score = mockk()
  private val scoreService: ScoreService = mockk()
  private val scoreController = ScoreController(scoreService)

  @Test
  fun dumbCoverageTests() {
    scoreController.scoreService = scoreService
  }

  @Test
  fun whenCreateScore_throwsException_thenShowError() {
    every { scoreService.createScore(score) } throws IllegalArgumentException("error message")

    val result: ResponseEntity<ScoreWithPossibleError> = scoreController.addScore(score)

    val expected =
      ScoreWithPossibleError(score, mapOf("error" to true, "errorMessage" to "error message"))

    assertNotNull(result.body)
    assertEquals(HttpStatus.BAD_REQUEST, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenCreateScore_succeeds_thenShowNoError() {
    every { scoreService.createScore(score) } returns score

    val result: ResponseEntity<ScoreWithPossibleError> = scoreController.addScore(score)

    val expected = ScoreWithPossibleError(score, null)

    assertNotNull(result.body)
    assertEquals(HttpStatus.OK, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenUpdateScore_throwsException_thenShowError() {
    every { scoreService.updateScore(score) } throws IllegalArgumentException("error message")

    val result: ResponseEntity<ScoreWithPossibleError> = scoreController.updateScore(score)

    val expected =
      ScoreWithPossibleError(score, mapOf("error" to true, "errorMessage" to "error message"))

    assertNotNull(result.body)
    assertEquals(HttpStatus.BAD_REQUEST, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenUpdateScore_succeeds_thenShowNoError() {
    every { scoreService.updateScore(score) } returns score

    val result: ResponseEntity<ScoreWithPossibleError> = scoreController.updateScore(score)

    val expected = ScoreWithPossibleError(score, null)

    assertNotNull(result.body)
    assertEquals(HttpStatus.OK, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenGetScore_throwsException_thenShowError() {
    every { scoreService.getScore(1L) } throws IllegalArgumentException("error message")

    val result: ResponseEntity<ScoreWithPossibleError> = scoreController.getScore(1L)

    val expected =
      ScoreWithPossibleError(null, mapOf("error" to true, "errorMessage" to "error message"))

    assertNotNull(result.body)
    assertEquals(HttpStatus.BAD_REQUEST, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenGetScore_succeeds_thenShowNoError() {
    every { scoreService.getScore(1L) } returns score

    val result: ResponseEntity<ScoreWithPossibleError> = scoreController.getScore(1L)

    val expected = ScoreWithPossibleError(score, null)

    assertNotNull(result.body)
    assertEquals(HttpStatus.OK, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenGetScores_hasEmptyList_thenReturnEmptyList() {
    every { scoreService.getAllScores() } returns emptyList()

    val result: ResponseEntity<List<Score>> = scoreController.getScores()

    val expected = emptyList<List<Score>>()

    assertNotNull(result.body)
    assertEquals(HttpStatus.OK, result.statusCode)
    assertEquals(expected, result.body)
  }

  @Test
  fun whenGetScores_hasScore_thenListOfScore() {
    every { scoreService.getAllScores() } returns listOf(score)

    val result: ResponseEntity<List<Score>> = scoreController.getScores()

    val expected = listOf(score)

    assertNotNull(result.body)
    assertEquals(HttpStatus.OK, result.statusCode)
    assertEquals(expected, result.body)
  }
}
