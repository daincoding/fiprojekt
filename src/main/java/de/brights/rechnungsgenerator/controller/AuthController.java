package de.brights.rechnungsgenerator.controller;

import de.brights.rechnungsgenerator.dto.*;
import de.brights.rechnungsgenerator.entity.Nutzer;
import de.brights.rechnungsgenerator.services.NutzerService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final NutzerService service;

    public AuthController(NutzerService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest req, HttpSession session) {
        var n = service.login(req.email(), req.password());
        session.setAttribute("USER_ID", n.getId());
        return ResponseEntity.ok(UserResponse.from(n));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest req, HttpSession session) {
        var n = service.register(req);
        session.setAttribute("USER_ID", n.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.from(n));
    }
}