package live.bfpointstracker.app.service

import live.bfpointstracker.app.model.Game
import live.bfpointstracker.app.repository.GameRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class GameService(var gameRepository: GameRepository) {
  fun createGame(game: Game): Game {
    if (game.gameNum == 0L) {
      throw IllegalArgumentException("Game number must be a positive integer.")
    }
    if (gameRepository.findByIdOrNull(game.gameNum) != null) {
      throw IllegalArgumentException(
        "Game with gameNum=${game.gameNum} already exists, please use update."
      )
    }
    return gameRepository.save(game)
  }

  fun updateGame(game: Game): Game {
    if (game.gameNum == 0L) {
      throw IllegalArgumentException("Game number must be a positive integer.")
    }
    gameRepository.findByIdOrNull(game.gameNum)
      ?: throw IllegalArgumentException(
        "Game with gameNum=${game.gameNum} does not exist, please use create."
      )
    return gameRepository.save(game)
  }

  fun getGame(id: Long): Game? {
    return gameRepository.findByIdOrNull(id)
      ?: throw IllegalArgumentException("Game with gameNum=${id} does not exist.")
  }

  fun getAllGames(): List<Game> {
    return gameRepository.findAll()
  }
}
