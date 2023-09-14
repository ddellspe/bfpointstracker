package live.bfpointstracker.app.model

data class GameWithPossibleError(var game: Game? = null, var errors: Map<String, Any>? = null)
