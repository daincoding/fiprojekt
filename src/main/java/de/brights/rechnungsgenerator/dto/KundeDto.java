package de.brights.rechnungsgenerator.dto;

import de.brights.rechnungsgenerator.entity.Kunde;

public record KundeDto(Long id, String name, String strasse, String plz, String ort, String email, String telefon, Long firmaId) {
    public static KundeDto from(Kunde k) {
        return new KundeDto(k.getId(), k.getName(), k.getStrasse(), k.getPlz(), k.getOrt(), k.getEmail(), k.getTelefon(), k.getFirma().getId());
    }
}
