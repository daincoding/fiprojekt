package de.brights.rechnungsgenerator.controller;

import de.brights.rechnungsgenerator.dto.RechnungDto;
import de.brights.rechnungsgenerator.entity.*;
import de.brights.rechnungsgenerator.security.CurrentUser;
import de.brights.rechnungsgenerator.services.FirmaService;
import de.brights.rechnungsgenerator.services.KundeService;
import de.brights.rechnungsgenerator.services.PdfService;
import de.brights.rechnungsgenerator.services.RechnungService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    private final RechnungService service;
    private final FirmaService firmaService;
    private final KundeService kundeService;
    private final CurrentUser current;

    private final PdfService pdfService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public InvoiceController(RechnungService s, FirmaService f, KundeService k, CurrentUser c, PdfService pdfService) {
        this.service = s; this.firmaService = f; this.kundeService = k; this.current = c; this.pdfService = pdfService;
    }

    @GetMapping(value = "/{id}/export/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<ByteArrayResource> exportPdf(
            @PathVariable Long id,
            @RequestParam(value = "color", required = false) String colorHex
    ) {
        var owner = current.require();
        var r = service.getOwned(id, owner);

        try {
            var bytes = pdfService.buildInvoicePdf(
                    r,
                    colorHex,                                  // darf null/leer sein
                    Path.of(System.getProperty("user.dir"), uploadDir)
            );

            var safe = (r.getRechnungsnummer() == null ? String.valueOf(r.getId()) :
                    r.getRechnungsnummer().replaceAll("[^a-zA-Z0-9._-]", "_"));
            var filename = "Rechnung-" + safe + ".pdf";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .contentLength(bytes.length)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new ByteArrayResource(bytes));
        } catch (Exception ex) {
            // <- entscheidend zum Debuggen
            ex.printStackTrace(); // oder Logger.error(...)
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "PDF-Generierung fehlgeschlagen");
        }
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
    public List<RechnungDto> list(@RequestParam(required = false) Long companyId) {
        var owner = current.require();
        if (companyId == null) {
            // Alle Rechnungen aller Firmen des Users
            return service.listAllByOwner(owner).stream().map(RechnungDto::from).toList();
        } else {
            var firma = firmaService.getOwned(companyId, owner);
            return service.listByFirma(firma).stream().map(RechnungDto::from).toList();
        }
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

    @PatchMapping("/{id}/status")
    public RechnungDto updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        var owner = current.require();
        var newStatus = body.getOrDefault("status", "").trim();
        if (newStatus.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status required");
        }
        var updated = service.updateStatusOwned(id, owner, newStatus);
        return RechnungDto.from(updated);
    }
}