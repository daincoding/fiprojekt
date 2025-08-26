package de.brights.rechnungsgenerator.repository;

import de.brights.rechnungsgenerator.dto.Kunde;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KundeRepository extends JpaRepository<Kunde, Long> {
    // Optional: z. B. findByFirmaId(Long firmaId)
}
