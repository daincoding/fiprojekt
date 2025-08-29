package de.brights.rechnungsgenerator.dto;

import de.brights.rechnungsgenerator.entity.Firma;

public record FirmaDto(Long id, String name, String strasse, String plz, String ort, String email, String ustIdNr, String telefon, Boolean umsatzsteuer, String logoUrl, String bank,
                       String iban,
                       String bic) {
    public static FirmaDto from(Firma f) {
        return new FirmaDto(f.getId(), f.getName(), f.getStrasse(), f.getPlz(), f.getOrt(), f.getEmail(), f.getUstIdNr(), f.getTelefon(), f.getUmsatzsteuer(), f.getLogoUrl(), f.getBank(), f.getIban(), f.getBic());
    }
}
