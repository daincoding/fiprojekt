package de.brights.rechnungsgenerator.dto;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Kunde {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String strasse;
    private String plz;
    private String ort;
    private String email;
    private String telefon;

    @ManyToOne
    private Firma firma;

    @OneToMany(mappedBy = "kunde")
    private List<Rechnung> rechnungen;

    // Getter & Setter
    // ...
}
