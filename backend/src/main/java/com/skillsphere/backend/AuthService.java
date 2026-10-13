
package com.skillsphere.backend;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public String signup(AuthRequest request) {
        if (request.getUsername() == null ||
                request.getUsername().isBlank() ||
                request.getEmail() == null ||
                request.getEmail().isBlank() ||
                request.getPassword() == null ||
                request.getPassword().length() < 8) {
            throw new IllegalArgumentException(
                    "Enter a username, email, and password of at least 8 characters."
            );
        }

        String email = request.getEmail().trim().toLowerCase();
        String username = request.getUsername().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists."
            );
        }

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException(
                    "This username is already taken."
            );
        }

        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        AppUser user = new AppUser(
                username,
                email,
                hashedPassword
        );

        userRepository.save(user);

        return "Account created successfully!";
    }

    public String login(AuthRequest request) {
        if (request.getEmail() == null ||
                request.getPassword() == null) {
            throw new IllegalArgumentException(
                    "Email and password are required."
            );
        }

        String email = request.getEmail().trim().toLowerCase();

        Optional<AppUser> user =
                userRepository.findByEmail(email);

        if (user.isEmpty() ||
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.get().getPassword())) {
            throw new IllegalArgumentException(
                    "Invalid email or password."
            );
        }

        return "Login successful!";
    }
}
