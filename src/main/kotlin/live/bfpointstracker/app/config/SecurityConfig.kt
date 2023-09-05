package live.bfpointstracker.app.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {

  @Bean
  fun webSecurityCustomizer(): WebSecurityCustomizer {
    return WebSecurityCustomizer { web ->
      web
        .ignoring()
        .requestMatchers(
          "/",
          "/static/**",
          "index.html",
          "manifest.json",
          "favicon**",
          "apple-touch-icon-**",
          "robots.txt"
        )
    }
  }

  @Bean
  fun filterChain(http: HttpSecurity): SecurityFilterChain {
    http
      .csrf { customizer -> customizer.disable() }
      .authorizeHttpRequests { auth ->
        auth
          .requestMatchers("/api/scores", "/swagger-ui/**", "/v3/**")
          .permitAll()
          .anyRequest()
          .authenticated()
      }
      .oauth2Login(Customizer.withDefaults())
      .sessionManagement { sessions ->
        sessions.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      }

    return http.build()
  }
}
