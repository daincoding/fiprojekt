package de.brights.rechnungsgenerator.services;

import de.brights.rechnungsgenerator.entity.Kunde;
import de.brights.rechnungsgenerator.entity.Firma;
import de.brights.rechnungsgenerator.entity.Nutzer;
import de.brights.rechnungsgenerator.repository.KundeRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;

@Service
public class KundeService {
    private final KundeRepository repo;
    public KundeService(KundeRepository repo){ this.repo = repo; }

    public Kunde create(Kunde k, Firma f){ k.setFirma(f); return repo.save(k); }
    public List<Kunde> listByFirma(Firma f){ return repo.findByFirma(f); }
    public Kunde get(Long id){
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    public Kunde getOwned(Long id, Nutzer owner) {
        var k = get(id);
        if (!k.getFirma().getNutzer().getId().equals(owner.getId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return k;
    }
    public Kunde updateOwned(Long id, Nutzer owner, Kunde in){
        var k = getOwned(id, owner);
        if (!k.getFirma().getNutzer().getId().equals(owner.getId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return repo.save(k);
    }
    public void deleteOwned(Long id, Nutzer owner){ repo.delete(getOwned(id, owner)); }
}