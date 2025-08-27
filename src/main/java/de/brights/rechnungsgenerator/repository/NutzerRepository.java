package de.brights.rechnungsgenerator.repository;


import de.brights.rechnungsgenerator.entity.Nutzer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NutzerRepository extends JpaRepository<Nutzer, Long> {
    Optional<Nutzer> findByEmail(String email);
    Optional<Nutzer> findByUsername(String username);
}