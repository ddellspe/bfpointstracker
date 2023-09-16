package live.bfpointstracker.app.controller

import live.bfpointstracker.app.model.Game
import live.bfpointstracker.app.model.GameData
import live.bfpointstracker.app.model.Score
import live.bfpointstracker.app.service.GameService
import live.bfpointstracker.app.service.ScoreService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class DataController(var gameService: GameService, var scoreService: ScoreService) {

  @GetMapping("/gamedata")
  fun getGameData(): GameData {
    val scores: List<Score> = scoreService.getAllScores()
    val games: List<Game> = gameService.getAllGames()
    return GameData(games, scores)
  }
}
