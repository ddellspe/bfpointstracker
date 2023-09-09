package live.bfpointstracker.app.config

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.io.PrintWriter
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint
import org.springframework.stereotype.Component

@Component
class AppBasicAuthenticationEntryPoint : BasicAuthenticationEntryPoint() {

  override fun commence(
    request: HttpServletRequest?,
    response: HttpServletResponse?,
    authException: AuthenticationException?
  ) {
    response?.addHeader("WWW-Authenticate", "Basic realm=$realmName")
    response?.status = HttpServletResponse.SC_UNAUTHORIZED
    val writer: PrintWriter? = response?.writer
    writer?.println("HTTP Status 401 - " + authException?.message)
  }
}
