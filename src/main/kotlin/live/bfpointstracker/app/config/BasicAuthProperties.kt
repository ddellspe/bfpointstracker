package live.bfpointstracker.app.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.factory.PasswordEncoderFactories

@ConfigurationProperties(prefix = "auth")
class BasicAuthProperties {
  private lateinit var users: Map<String, UserDetail>

  fun getUsers(): Map<String, UserDetail> {
    return users
  }

  fun setUsers(users: Map<String, UserDetail>) {
    this.users = users
  }

  fun getUserDetails(): Set<UserDetails> {
    return users.entries
      .map { entry ->
        User.withUsername(entry.key)
          .passwordEncoder(PasswordEncoderFactories.createDelegatingPasswordEncoder()::encode)
          .password(entry.value.password)
          .roles(entry.value.role)
          .build()
      }
      .toSet()
  }

  class UserDetail {
    lateinit var password: String
    lateinit var role: String
  }
}
