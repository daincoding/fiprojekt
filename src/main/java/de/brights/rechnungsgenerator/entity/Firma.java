package de.brights.rechnungsgenerator.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@Entity
@Table(name = "firma")
public class Firma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    private String strasse;
    private String plz;
    private String ort;

    @Email
    private String email;

    @Column(name = "ust_id_nr")
    private String ustIdNr;

    private String telefon;

    /** Falls das „umsatzsteuerpflichtig“ meint: boolean ok. */
    private Boolean umsatzsteuer;

    private String logoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nutzer_id", nullable = false)
    private Nutzer nutzer;

    @OneToMany(mappedBy = "firma", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Kunde> kunden;

    @OneToMany(mappedBy = "firma", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Rechnung> rechnungen;
}