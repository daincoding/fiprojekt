package de.brights.rechnungsgenerator.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "Benutzer")
public class User {

    // Getter & Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;
    private String role;

    @OneToMany(mappedBy = "user")
    private List<Firma> firmen;

}
