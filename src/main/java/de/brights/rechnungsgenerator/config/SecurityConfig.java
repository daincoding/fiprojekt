package de.brights.rechnungsgenerator.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Für H2-Console: CSRF für diese Pfade ignorieren
                .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**", "/api/**"))
                // H2-Console läuft im Frame -> gleiches Origin erlauben
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                // Welche Requests dürfen ohne Login passieren?
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/h2-console/**",
                                "/api/users/register",
                                "/api/users/login",
                                "/api/users/create"
                        ).permitAll()
                        // alles andere aktuell auch offen (für DEV):
                        .anyRequest().permitAll()
                )
                // keine Formular-Loginseite erzwingen
                .formLogin(login -> login.disable())
                // Basic-Auth optional aktivieren (kannst du auch weglassen)
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
