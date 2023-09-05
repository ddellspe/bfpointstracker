package live.bfpointstracker.app.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id

@Entity
data class Score(
  @Id @GeneratedValue var id: Long = 0,
  var quarter: Int = 1,
  var minutesRemaining: Int = 0,
  var secondsRemaining: Int = 0,
  var points: Int = 0,
  var gameNum: Long = 0
)
