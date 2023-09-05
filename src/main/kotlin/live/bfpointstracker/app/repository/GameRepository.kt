package live.bfpointstracker.app.repository

import live.bfpointstracker.app.model.Game
import org.springframework.data.repository.ListCrudRepository
import org.springframework.stereotype.Repository

@Repository interface GameRepository : ListCrudRepository<Game, Long> {}
