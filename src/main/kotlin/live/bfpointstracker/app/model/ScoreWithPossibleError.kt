package live.bfpointstracker.app.model

data class ScoreWithPossibleError(var score: Score? = null, var errors: Map<String, Any>? = null)
