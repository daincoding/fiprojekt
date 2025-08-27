package de.brights.rechnungsgenerator.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter
@Entity
@Table(name = "rechnung")
public class Rechnung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String rechnungsnummer;

    @Column(nullable = false)
    private LocalDate datum;

    private String leistung;

    @Column(nullable = false)
    private BigDecimal betrag;

    @Column(nullable = false)
    private String zahlungsstatus; // besser als ENUM machen: "OFFEN", "BEZAHLT", "STORNIERT"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "firma_id", nullable = false)
    private Firma firma;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kunde_id", nullable = false)
    private Kunde kunde;
}
