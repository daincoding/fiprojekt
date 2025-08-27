// CompanyController -> /api/companies
package de.brights.rechnungsgenerator.controller;
import de.brights.rechnungsgenerator.dto.FirmaDto;
import de.brights.rechnungsgenerator.entity.Firma;
import de.brights.rechnungsgenerator.entity.Nutzer;
import de.brights.rechnungsgenerator.security.CurrentUser;
import de.brights.rechnungsgenerator.services.FirmaService;
import de.brights.rechnungsgenerator.repository.NutzerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    private final FirmaService service;
    private final CurrentUser current;

    public CompanyController(FirmaService service, CurrentUser current) {
        this.service = service; this.current = current;
    }

    @PostMapping
    public ResponseEntity<FirmaDto> create(@RequestBody Firma body) {
        var owner = current.require();
        var saved = service.create(body, owner);
        return ResponseEntity.created(URI.create("/api/companies/" + saved.getId()))
                .body(FirmaDto.from(saved));
    }

    @GetMapping
    public List<FirmaDto> list() {
        var owner = current.require();
        return service.findAllBy(owner).stream().map(FirmaDto::from).toList();
    }

    @GetMapping("/{id}")
    public FirmaDto get(@PathVariable Long id) {
        var owner = current.require();
        return FirmaDto.from(service.getOwned(id, owner)); // Ownership-Check
    }

    @PutMapping("/{id}")
    public FirmaDto update(@PathVariable Long id, @RequestBody Firma body) {
        var owner = current.require();
        return FirmaDto.from(service.updateOwned(id, owner, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        var owner = current.require();
        service.deleteOwned(id, owner);
        return ResponseEntity.noContent().build();
    }
}