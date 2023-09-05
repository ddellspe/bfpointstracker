package live.bfpointstracker.app.service

import live.bfpointstracker.app.model.Game
import live.bfpointstracker.app.repository.GameRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class GameService(var gameRepository: GameRepository) {
  fun updateOrSaveGame(game: Game): Game {
    return gameRepository.save(game)
  }

  fun getGame(id: Long): Game? {
    return gameRepository.findByIdOrNull(id)
  }

  fun getAllGames(): List<Game> {
    return gameRepository.findAll()
  }
}
