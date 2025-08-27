package de.brights.rechnungsgenerator.dto;

import de.brights.rechnungsgenerator.entity.Rechnung;
import java.math.BigDecimal;
import java.time.LocalDate;

public record RechnungDto(Long id, String rechnungsnummer, LocalDate datum, String leistung, BigDecimal betrag, String zahlungsstatus, Long firmaId, Long kundeId) {
    public static RechnungDto from(Rechnung r) {
        return new RechnungDto(r.getId(), r.getRechnungsnummer(), r.getDatum(), r.getLeistung(), r.getBetrag(), r.getZahlungsstatus(), r.getFirma().getId(), r.getKunde().getId());
    }
}
