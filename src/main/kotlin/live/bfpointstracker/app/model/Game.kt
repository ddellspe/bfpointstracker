package live.bfpointstracker.app.model

import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.time.OffsetDateTime

@Entity
data class Game(
  @Id var gameNum: Long = 0,
  var date: OffsetDateTime = OffsetDateTime.now(),
  var opponent: String = "",
  var opponentLogo: String = ""
)
