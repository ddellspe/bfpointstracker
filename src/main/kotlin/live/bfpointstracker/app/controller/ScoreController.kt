package live.bfpointstracker.app.controller

import live.bfpointstracker.app.model.Score
import live.bfpointstracker.app.model.ScoreWithPossibleError
import live.bfpointstracker.app.service.ScoreService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class ScoreController(var scoreService: ScoreService) {
  @PostMapping("/score")
  fun addScore(@RequestBody score: Score): ResponseEntity<ScoreWithPossibleError> {
    return try {
      ResponseEntity.ok(ScoreWithPossibleError(scoreService.createScore(score)))
    } catch (e: IllegalArgumentException) {
      val errorMap: MutableMap<String, Any> = HashMap()
      errorMap["error"] = true
      errorMap["errorMessage"] = e.message!!
      ResponseEntity(ScoreWithPossibleError(score, errorMap), HttpStatus.BAD_REQUEST)
    }
  }

  @PutMapping("/score")
  fun updateScore(@RequestBody score: Score): ResponseEntity<ScoreWithPossibleError> {
    return try {
      ResponseEntity.ok(ScoreWithPossibleError(scoreService.updateScore(score)))
    } catch (e: IllegalArgumentException) {
      val errorMap: MutableMap<String, Any> = HashMap()
      errorMap["error"] = true
      errorMap["errorMessage"] = e.message!!
      ResponseEntity(ScoreWithPossibleError(score, errorMap), HttpStatus.BAD_REQUEST)
    }
  }

  @GetMapping("/score/{id}")
  fun getScore(@PathVariable id: Long): ResponseEntity<ScoreWithPossibleError> {
    return try {
      ResponseEntity.ok(ScoreWithPossibleError(scoreService.getScore(id)))
    } catch (e: IllegalArgumentException) {
      val errorMap: MutableMap<String, Any> = HashMap()
      errorMap["error"] = true
      errorMap["errorMessage"] = e.message!!
      ResponseEntity(ScoreWithPossibleError(null, errorMap), HttpStatus.BAD_REQUEST)
    }
  }

  @GetMapping("/scores")
  fun getScores(): ResponseEntity<List<Score>> {
    val scores: List<Score> = scoreService.getAllScores()
    return ResponseEntity(scores, HttpStatus.OK)
  }
}
