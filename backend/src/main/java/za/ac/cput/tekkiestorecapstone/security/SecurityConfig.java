/*
 * SecurityConfig.java
 * Spring Security configuration: reads the JWT on each request, protects payments and
 * order changes, disables CSRF for stateless REST, and configures CORS for Vite frontend.
 * Author: Ethan Williams (221454780)
 */
package za.ac.cput.tekkiestorecapstone.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtUtil jwtUtil) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Changing your own password needs a login; the rest of /auth is public
                        .requestMatchers("/auth/change-password").authenticated()
                        .requestMatchers("/auth/**").permitAll()
                        // Only customers can pay; admin and staff accounts can't buy from the store
                        .requestMatchers("/payments/**").hasRole("CUSTOMER")
                        // Main admin only: admin accounts, deleting products, and changing customer records
                        .requestMatchers("/admin/accounts", "/admin/register").hasRole("ADMIN")
                        .requestMatchers("/shoe/delete/**").hasRole("ADMIN")
                        .requestMatchers("/customer/create", "/customer/update", "/customer/read/**", "/customer/delete/**").hasRole("ADMIN")
                        // Staff and main admin: orders, products, inventory, the customer list, and activity check-ins
                        .requestMatchers("/order/create", "/order/update", "/order/delete/**", "/order/*/status", "/order/getAll").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers("/orderItem/create", "/orderItem/update", "/orderItem/delete/**").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers("/shoe/create", "/shoe/update", "/shoe/upload-image").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers("/shoeVariant/create", "/shoeVariant/update", "/shoeVariant/delete/**").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers("/customer/getAll").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN", "STAFF")
                        .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtAuthFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
