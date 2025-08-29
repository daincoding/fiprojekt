package de.brights.rechnungsgenerator.services;

import de.brights.rechnungsgenerator.entity.Firma;
import de.brights.rechnungsgenerator.entity.Nutzer;
import de.brights.rechnungsgenerator.repository.FirmaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FirmaService {
    private final FirmaRepository repo;
    public FirmaService(FirmaRepository repo){ this.repo = repo; }

    /* ------- READ ------- */

    public List<Firma> findAllBy(Nutzer owner){ return repo.findByNutzer(owner); }

    public Firma get(Long id){
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Firma nicht gefunden"));
    }

    public Firma getOwned(Long id, Nutzer owner) {
        var f = get(id);
        if (!f.getNutzer().getId().equals(owner.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Kein Zugriff");
        return f;
    }

    /* ------- WRITE (Transactional) ------- */

    @Transactional
    public Firma create(Firma f, Nutzer owner){
        f.setNutzer(owner);

        // NEU: Bankdaten normalisieren
        f.setBank(clean(f.getBank()));
        f.setIban(normalizeIban(f.getIban()));
        f.setBic(normalizeBic(f.getBic()));

        return repo.save(f);
    }

    @Transactional
    public void deleteOwned(Long id, Nutzer owner) {
        repo.delete(getOwned(id, owner));
    }

    @Transactional
    public Firma updateOwned(Long id, Nutzer owner, Firma in) {
        var f = getOwned(id, owner); // Ownership geprüft

        // Felder in die gemanagte Entity kopieren:
        f.setName(in.getName());
        f.setEmail(in.getEmail());
        f.setStrasse(in.getStrasse());
        f.setPlz(in.getPlz());
        f.setOrt(in.getOrt());
        f.setTelefon(in.getTelefon());
        f.setUstIdNr(in.getUstIdNr());
        f.setUmsatzsteuer(in.getUmsatzsteuer());

        // f ist managed; save() optional, aber okay:
        return repo.save(f);
    }

    // Falls du ein ungesichertes Update brauchst (meist nicht):
    @Transactional
    public Firma update(Long id, Firma in){
        var f = get(id);
        f.setName(in.getName());
        f.setEmail(in.getEmail());
        f.setStrasse(in.getStrasse());
        f.setPlz(in.getPlz());
        f.setOrt(in.getOrt());
        f.setTelefon(in.getTelefon());
        f.setUstIdNr(in.getUstIdNr());
        f.setUmsatzsteuer(in.getUmsatzsteuer());
        return repo.save(f);
    }

    @Transactional
    public void delete(Long id){ repo.deleteById(id); }


    public Firma save(Firma f) { return repo.save(f); }

    /* ------- Helpers ------- */

    private String clean(String s) {
        return (s == null) ? null : s.trim();
    }

    private String normalizeIban(String iban) {
        if (iban == null || iban.isBlank()) return null;
        var v = iban.replaceAll("\\s+", "").toUpperCase();
        // sehr einfache Plausibilitätsprüfung (kein vollständiger IBAN-Check)
        if (!v.matches("[A-Z]{2}[0-9A-Z]{13,32}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ungültige IBAN");
        }
        return v;
    }

    private String normalizeBic(String bic) {
        if (bic == null || bic.isBlank()) return null;
        var v = bic.replaceAll("\\s+", "").toUpperCase(); // 8 oder 11 Zeichen
        if (!v.matches("[A-Z0-9]{8}([A-Z0-9]{3})?")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ungültiger BIC");
        }
        return v;
    }
}