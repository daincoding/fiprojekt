package de.brights.rechnungsgenerator.repository;

import de.brights.rechnungsgenerator.dto.Rechnung;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RechnungRepository extends JpaRepository<Rechnung, Long> {
    List<Rechnung> findByKundeId(Long kundeId);
    List<Rechnung> findByFirmaId(Long firmaId);
    List<Rechnung> findByRechnungsnummerContainingIgnoreCase(String query);
}
