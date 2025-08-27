package de.brights.rechnungsgenerator.dto;

import de.brights.rechnungsgenerator.entity.Nutzer;

public record UserResponse(Long id, String email, String role) {
    public static UserResponse from(Nutzer n) {
        return new UserResponse(n.getId(), n.getEmail(), n.getRole());
    }
}