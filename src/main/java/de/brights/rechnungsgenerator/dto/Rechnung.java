package de.brights.rechnungsgenerator.dto;

import jakarta.persistence.*;

@Entity
public class Rechnung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rechnungsnummer;
    private String datum;
    private String leistung;
    private double betrag;
    private String zahlungsstatus;

    @ManyToOne
    private Firma firma;

    @ManyToOne
    private Kunde kunde;

    // Getter & Setter
    // ...
}
