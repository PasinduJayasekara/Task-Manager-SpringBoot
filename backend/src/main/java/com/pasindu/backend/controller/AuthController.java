package com.pasindu.backend.controller;

import com.pasindu.backend.dto.AuthResponseDTO;
import com.pasindu.backend.dto.LoginRequestDTO;
import com.pasindu.backend.dto.RegisterRequestDTO;
import com.pasindu.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
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
}