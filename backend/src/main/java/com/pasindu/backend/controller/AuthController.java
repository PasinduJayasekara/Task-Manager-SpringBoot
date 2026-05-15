package com.pasindu.backend.controller;

import com.pasindu.backend.dto.AuthResponseDTO;
import com.pasindu.backend.dto.LoginRequestDTO;
import com.pasindu.backend.dto.RegisterRequestDTO;
import com.pasindu.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.pasindu.backend.model.User;
import com.pasindu.backend.repositary.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    private final UserRepository userRepository;

    public AuthController(
            AuthService authService,
            UserRepository userRepository
    ) {

        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public AuthResponseDTO register(
            @Valid @RequestBody RegisterRequestDTO request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(
            @Valid @RequestBody LoginRequestDTO request) {

        return authService.login(request);
    }

    @GetMapping("/me")
    public User getCurrentUser() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}