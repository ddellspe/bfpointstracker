package live.bfpointstracker.app.controller

import live.bfpointstracker.app.model.Game
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
  fun addGame(@RequestBody game: Game): ResponseEntity<Game> {
    return ResponseEntity.ok(gameService.updateOrSaveGame(game))
  }

  @PutMapping("/game")
  fun updateGame(@RequestBody game: Game): ResponseEntity<Game> {
    return ResponseEntity.ok(gameService.updateOrSaveGame(game))
  }

  @GetMapping("/game/{id}")
  fun getGame(@PathVariable id: Long): ResponseEntity<Game> {
    val game: Game? = gameService.getGame(id)
    return if (game != null) {
      ResponseEntity(game, HttpStatus.OK)
    } else {
      ResponseEntity(HttpStatus.BAD_REQUEST)
    }
  }
}
