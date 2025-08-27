package de.brights.rechnungsgenerator.security;

import de.brights.rechnungsgenerator.entity.Nutzer;
import de.brights.rechnungsgenerator.repository.NutzerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpSession;

@Component
public class CurrentUser {
    private final NutzerRepository repo;
    private final HttpSession session;

    public CurrentUser(NutzerRepository repo, HttpSession session) {
        this.repo = repo; this.session = session;
    }

    public Nutzer require() {
        Object id = session.getAttribute("USER_ID");
        if (id == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nicht eingeloggt");
        return repo.findById((Long) id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nutzer nicht gefunden"));
    }
}
