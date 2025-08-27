package de.brights.rechnungsgenerator.repository;

import de.brights.rechnungsgenerator.entity.Kunde;
import de.brights.rechnungsgenerator.entity.Firma;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KundeRepository extends JpaRepository<Kunde, Long> {
    List<Kunde> findByFirma(Firma firma);
}