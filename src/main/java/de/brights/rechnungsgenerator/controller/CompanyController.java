package de.brights.rechnungsgenerator.controller;

import de.brights.rechnungsgenerator.dto.FirmaDto;
import de.brights.rechnungsgenerator.entity.Firma;
import de.brights.rechnungsgenerator.security.CurrentUser;
import de.brights.rechnungsgenerator.services.FirmaService;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final FirmaService service;
    private final CurrentUser current;
    private final Environment env;

    public CompanyController(FirmaService service, CurrentUser current, Environment env) {
        this.service = service;
        this.current = current;
        this.env = env;
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
        return FirmaDto.from(service.getOwned(id, owner));
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

    /* ---------- Logo Upload ---------- */

    @PostMapping("/{id}/logo")
    public ResponseEntity<FirmaDto> uploadLogo(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        var owner = current.require();
        var firma = service.getOwned(id, owner);

        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "empty file");
        }

        Path uploads = Path.of(
                System.getProperty("user.dir"),
                env.getProperty("app.upload.dir", "uploads")
        );
        Files.createDirectories(uploads);

        String ext = Optional.ofNullable(file.getOriginalFilename())
                .filter(n -> n.contains("."))
                .map(n -> n.substring(n.lastIndexOf('.')))
                .orElse(".png");

        Path dest = uploads.resolve("company-" + id + ext);
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

        firma.setLogoUrl("/api/companies/" + id + "/logo");
        service.save(firma);

        return ResponseEntity.ok(FirmaDto.from(firma));
    }

    @GetMapping("/{id}/logo")
    public ResponseEntity<Resource> getLogo(@PathVariable Long id) throws IOException {
        Path uploads = Path.of(
                System.getProperty("user.dir"),
                env.getProperty("app.upload.dir", "uploads")
        );

        Path file;
        try (Stream<Path> list = Files.list(uploads)) {
            file = list.filter(p -> p.getFileName().toString().startsWith("company-" + id))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        }

        Resource res = new UrlResource(file.toUri());
        String ct = Files.probeContentType(file);

        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=86400")
                .contentType(MediaType.parseMediaType(ct != null ? ct : "image/png"))
                .body(res);
    }
}