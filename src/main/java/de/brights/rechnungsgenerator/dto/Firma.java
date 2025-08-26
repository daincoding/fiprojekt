package de.brights.rechnungsgenerator.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Entity
public class Firma {

    // Getter & Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String strasse;
    private String plz;
    private String ort;
    private String email;
    private String ustIdNr;
    private String telefon;
    private Boolean umsatzsteuer;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "firma")
    private List<Kunde> kunden;

    @OneToMany(mappedBy = "firma")
    private List<Rechnung> rechnungen;

}
