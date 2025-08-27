package de.brights.rechnungsgenerator.controller;

import de.brights.rechnungsgenerator.dto.KundeDto;
import de.brights.rechnungsgenerator.entity.*;
import de.brights.rechnungsgenerator.security.CurrentUser;
import de.brights.rechnungsgenerator.services.FirmaService;
import de.brights.rechnungsgenerator.services.KundeService;
import de.brights.rechnungsgenerator.repository.FirmaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final KundeService service;
    private final FirmaService firmaService;
    private final CurrentUser current;

    public CustomerController(KundeService s, FirmaService f, CurrentUser c) {
        this.service = s; this.firmaService = f; this.current = c;
    }

    @PostMapping
    public ResponseEntity<KundeDto> create(@RequestParam Long companyId, @RequestBody Kunde body) {
        var owner = current.require();
        var firma = firmaService.getOwned(companyId, owner); // check: gehört dem User
        var saved = service.create(body, firma);
        return ResponseEntity.created(URI.create("/api/customers/" + saved.getId()))
                .body(KundeDto.from(saved));
    }

    @GetMapping
    public List<KundeDto> list(@RequestParam Long companyId) {
        var owner = current.require();
        var firma = firmaService.getOwned(companyId, owner);
        return service.listByFirma(firma).stream().map(KundeDto::from).toList();
    }

    @GetMapping("/{id}")
    public KundeDto get(@PathVariable Long id) {
        var owner = current.require();
        var kunde = service.getOwned(id, owner);
        return KundeDto.from(kunde);
    }

    @PutMapping("/{id}")
    public KundeDto update(@PathVariable Long id, @RequestBody Kunde body) {
        var owner = current.require();
        var updated = service.updateOwned(id, owner, body);
        return KundeDto.from(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        var owner = current.require();
        service.deleteOwned(id, owner);
        return ResponseEntity.noContent().build();
    }
}
