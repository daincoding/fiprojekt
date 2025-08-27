package de.brights.rechnungsgenerator.services;

import de.brights.rechnungsgenerator.dto.RegisterRequest;
import de.brights.rechnungsgenerator.entity.Nutzer;
import de.brights.rechnungsgenerator.repository.NutzerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NutzerService {

    private final NutzerRepository repo;
    private final PasswordEncoder encoder;

    public NutzerService(NutzerRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Transactional
    public Nutzer register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (repo.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-Mail bereits vergeben");
        }
        Nutzer n = new Nutzer();
        n.setEmail(email);
        n.setPassword(encoder.encode(req.password()));
        n.setRole("USER");
        return repo.save(n);
    }

    public Nutzer login(String email, String rawPassword) {
        String norm = email.trim().toLowerCase();
        Nutzer n = repo.findByEmail(norm)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Benutzer nicht gefunden"));
        if (!encoder.matches(rawPassword, n.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Ungültige Anmeldedaten");
        }
        return n;
    }
}