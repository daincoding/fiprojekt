package de.brights.rechnungsgenerator.repository;

import de.brights.rechnungsgenerator.dto.Firma;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FirmaRepository extends JpaRepository<Firma, Long> {
    // Optional: weitere Methoden z. B. findByUserId(Long userId)
}
