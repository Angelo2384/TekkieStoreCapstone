/*
 * JwtAuthFilter.java
 * Tells Spring Security who is logged in (email and role) from a valid "Bearer" token.
 */
package za.ac.cput.tekkiestorecapstone.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;

import java.io.IOException;
import java.util.List;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomerRepository customerRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, CustomerRepository customerRepository) {
        this.jwtUtil = jwtUtil;
        this.customerRepository = customerRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            // The token is signed with JWT_SECRET, so its email and role cannot be faked
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token).toUpperCase();
                if (isStillValid(email, role)) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            email, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }

        chain.doFilter(request, response);
    }

    // An owner or staff token stops working as soon as the account is deleted
    private boolean isStillValid(String email, String role) {
        if (!role.equals("ADMIN") && !role.equals("STAFF")) {
            return true;
        }
        return customerRepository.findByEmail(email)
                .map(account -> role.equalsIgnoreCase(account.getRole()))
                .orElse(false);
    }
}
