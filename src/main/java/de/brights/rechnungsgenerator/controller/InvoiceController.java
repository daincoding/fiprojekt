package de.brights.rechnungsgenerator.controller;

import de.brights.rechnungsgenerator.dto.RechnungDto;
import de.brights.rechnungsgenerator.entity.*;
import de.brights.rechnungsgenerator.security.CurrentUser;
import de.brights.rechnungsgenerator.services.FirmaService;
import de.brights.rechnungsgenerator.services.KundeService;
import de.brights.rechnungsgenerator.services.RechnungService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    private final RechnungService service;
    private final FirmaService firmaService;
    private final KundeService kundeService;
    private final CurrentUser current;

    public InvoiceController(RechnungService s, FirmaService f, KundeService k, CurrentUser c) {
        this.service = s; this.firmaService = f; this.kundeService = k; this.current = c;
    }

    @PostMapping
    public ResponseEntity<RechnungDto> create(@RequestParam Long companyId,
                                              @RequestParam Long customerId,
                                              @RequestBody Rechnung body) {
        var owner = current.require();
        var firma = firmaService.getOwned(companyId, owner);
        var kunde = kundeService.getOwned(customerId, owner);


        if (!kunde.getFirma().getId().equals(firma.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kunde gehört nicht zur Firma");
        }

        var saved = service.create(body, firma, kunde);
        return ResponseEntity.created(URI.create("/api/invoices/" + saved.getId()))
                .body(RechnungDto.from(saved));
    }

    @GetMapping
    public List<RechnungDto> list(@RequestParam Long companyId) {
        var owner = current.require();
        var firma = firmaService.getOwned(companyId, owner);
        return service.listByFirma(firma).stream().map(RechnungDto::from).toList();
    }

    @GetMapping("/{id}")
    public RechnungDto get(@PathVariable Long id){
        var owner = current.require();
        return RechnungDto.from(service.getOwned(id, owner));
    }

    @PutMapping("/{id}")
    public RechnungDto update(@PathVariable Long id, @RequestBody Rechnung body){
        var owner = current.require();
        return RechnungDto.from(service.updateOwned(id, owner, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        var owner = current.require();
        service.deleteOwned(id, owner);
        return ResponseEntity.noContent().build();
    }
}