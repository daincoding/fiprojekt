package de.brights.rechnungsgenerator.repository;

import de.brights.rechnungsgenerator.entity.Nutzer;
import de.brights.rechnungsgenerator.entity.Rechnung;
import de.brights.rechnungsgenerator.entity.Firma;
import de.brights.rechnungsgenerator.entity.Kunde;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RechnungRepository extends JpaRepository<Rechnung, Long> {
    List<Rechnung> findByFirma(Firma firma);
    List<Rechnung> findByKunde(Kunde kunde);
    List<Rechnung> findByFirmaNutzer(Nutzer nutzer);
    Optional<Rechnung> findByRechnungsnummerAndFirma_Id(String rechnungsnummer, Long firmaId);
}
