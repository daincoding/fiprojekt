package de.brights.rechnungsgenerator.services;

import de.brights.rechnungsgenerator.entity.*;
import de.brights.rechnungsgenerator.repository.RechnungRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RechnungService {

    private final RechnungRepository repo;

    public RechnungService(RechnungRepository repo) {
        this.repo = repo;
    }

    /* ---------- CREATE / LIST / GET ---------- */

    @Transactional
    public Rechnung create(Rechnung r, Firma f, Kunde k) {
        // Guard: Kunde gehört zur Firma
        if (!k.getFirma().getId().equals(f.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kunde gehört nicht zur Firma");
        }
        r.setDeadline(
                r.getDeadline() == null ? r.getDatum() : r.getDeadline()
        );
        if (r.getDeadline().isBefore(r.getDatum())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deadline liegt vor dem Rechnungsdatum");
        }
        r.setFirma(f);
        r.setKunde(k);
        return repo.save(r);
    }

    public List<Rechnung> listByFirma(Firma f) {
        return repo.findByFirma(f);
    }

    public List<Rechnung> listByKunde(Kunde k) {
        return repo.findByKunde(k);
    }

    public List<Rechnung> listAllByOwner(Nutzer owner) {
        return repo.findByFirmaNutzer(owner);
    }

    public Rechnung get(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rechnung nicht gefunden"));
    }

    /* ---------- OWNERSHIP HELPERS ---------- */

    public Rechnung getOwned(Long id, Nutzer owner) {
        var r = get(id);
        if (!r.getFirma().getNutzer().getId().equals(owner.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Kein Zugriff");
        }
        return r;
    }

    /* ---------- UPDATE / DELETE mit Ownership ---------- */

    @Transactional
    public Rechnung updateOwned(Long id, Nutzer owner, Rechnung in) {
        var r = getOwned(id, owner);
        r.setRechnungsnummer(in.getRechnungsnummer());
        r.setDatum(in.getDatum());
        r.setLeistung(in.getLeistung());
        r.setBetrag(in.getBetrag());
        r.setZahlungsstatus(in.getZahlungsstatus());
        return repo.save(r);
    }

    @Transactional
    public void deleteOwned(Long id, Nutzer owner) {
        var r = getOwned(id, owner);
        repo.delete(r);
    }

    public Rechnung updateStatusOwned(Long id, Nutzer owner, String status) {
        var r = getOwned(id, owner);
        r.setZahlungsstatus(status);
        return repo.save(r);
    }
}