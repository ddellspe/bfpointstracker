package live.bfpointstracker.app.service

import live.bfpointstracker.app.model.Score
import live.bfpointstracker.app.repository.ScoreRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ScoreService(var scoreRepository: ScoreRepository) {
  fun saveOrUpdateScore(score: Score): Score {
    return scoreRepository.save(score)
  }

  fun getScore(id: Long): Score? {
    return scoreRepository.findByIdOrNull(id)
  }

  fun getAllScores(): List<Score> {
    return scoreRepository.findAll()
  }
}
