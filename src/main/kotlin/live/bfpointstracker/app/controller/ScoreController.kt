package live.bfpointstracker.app.controller

import live.bfpointstracker.app.model.Game
import live.bfpointstracker.app.model.Score
import live.bfpointstracker.app.service.GameService
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
class ScoreController(var scoreService: ScoreService, var gameService: GameService) {
  @PostMapping("/score")
  fun addScore(@RequestBody score: Score): ResponseEntity<Score> {
    val game: Game? = gameService.getGame(score.gameNum)
    return if (game == null) {
      ResponseEntity(score, HttpStatus.BAD_REQUEST)
    } else {
      ResponseEntity.ok(scoreService.saveOrUpdateScore(score))
    }
  }

  @PutMapping("/score")
  fun updateScore(@RequestBody score: Score): ResponseEntity<Score> {
    val game: Game? = gameService.getGame(score.gameNum)
    return if (game == null) {
      ResponseEntity(score, HttpStatus.BAD_REQUEST)
    } else {
      ResponseEntity.ok(scoreService.saveOrUpdateScore(score))
    }
  }

  @GetMapping("/score/{id}")
  fun getScore(@PathVariable id: Long): ResponseEntity<Score> {
    val score: Score? = scoreService.getScore(id)
    return if (score != null) {
      ResponseEntity(score, HttpStatus.OK)
    } else {
      ResponseEntity(HttpStatus.BAD_REQUEST)
    }
  }

  @GetMapping("/scores")
  fun getScores(): ResponseEntity<List<Score>> {
    val scores: List<Score> = scoreService.getAllScores()
    return ResponseEntity(scores, HttpStatus.OK)
  }
}
