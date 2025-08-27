package de.brights.rechnungsgenerator.repository;

import de.brights.rechnungsgenerator.entity.Firma;
import de.brights.rechnungsgenerator.entity.Nutzer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FirmaRepository extends JpaRepository<Firma, Long> {
    List<Firma> findByNutzer(Nutzer nutzer);
}