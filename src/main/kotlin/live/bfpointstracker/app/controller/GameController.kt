package live.bfpointstracker.app.controller

import live.bfpointstracker.app.model.Game
import live.bfpointstracker.app.model.GameWithPossibleError
import live.bfpointstracker.app.service.GameService
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
class GameController(var gameService: GameService) {
  @PostMapping("/game")
  fun addGame(@RequestBody game: Game): ResponseEntity<GameWithPossibleError> {
    return try {
      ResponseEntity.ok(GameWithPossibleError(gameService.createGame(game)))
    } catch (e: IllegalArgumentException) {
      val errorMap: MutableMap<String, Any> = HashMap()
      errorMap["error"] = true
      errorMap["errorMessage"] = e.message!!
      ResponseEntity(GameWithPossibleError(game, errorMap), HttpStatus.BAD_REQUEST)
    }
  }

  @PutMapping("/game")
  fun updateGame(@RequestBody game: Game): ResponseEntity<GameWithPossibleError> {
    return try {
      ResponseEntity.ok(GameWithPossibleError(gameService.updateGame(game)))
    } catch (e: IllegalArgumentException) {
      val errorMap: MutableMap<String, Any> = HashMap()
      errorMap["error"] = true
      errorMap["errorMessage"] = e.message!!
      ResponseEntity(GameWithPossibleError(game, errorMap), HttpStatus.BAD_REQUEST)
    }
  }

  @GetMapping("/game/{id}")
  fun getGame(@PathVariable id: Long): ResponseEntity<GameWithPossibleError> {
    return try {
      ResponseEntity.ok(GameWithPossibleError(gameService.getGame(id)))
    } catch (e: IllegalArgumentException) {
      val errorMap: MutableMap<String, Any> = HashMap()
      errorMap["error"] = true
      errorMap["errorMessage"] = e.message!!
      ResponseEntity(GameWithPossibleError(null, errorMap), HttpStatus.BAD_REQUEST)
    }
  }

  @GetMapping("/games")
  fun getGames(): ResponseEntity<List<Game>> {
    val games: List<Game> = gameService.getAllGames()
    return ResponseEntity(games, HttpStatus.OK)
  }
}
