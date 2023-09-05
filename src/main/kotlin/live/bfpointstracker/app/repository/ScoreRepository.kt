package live.bfpointstracker.app.repository

import live.bfpointstracker.app.model.Score
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.ListCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ScoreRepository : ListCrudRepository<Score, Long> {
  fun findByGameNum(gameNum: Long, pageable: Pageable): Page<Score>
}
