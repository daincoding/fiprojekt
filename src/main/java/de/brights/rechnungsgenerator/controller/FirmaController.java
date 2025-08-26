package de.brights.rechnungsgenerator.controller;

import de.brights.rechnungsgenerator.dto.Firma;
import de.brights.rechnungsgenerator.services.FirmaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
public class FirmaController {

    private final FirmaService firmaService;

    public FirmaController(FirmaService firmaService) {
        this.firmaService = firmaService;
    }

    @PostMapping
    public ResponseEntity<Firma> createFirma(@RequestBody Firma firma) {
        Firma neueFirma = firmaService.createFirma(firma);
        return ResponseEntity.status(HttpStatus.CREATED).body(neueFirma);
    }
}
