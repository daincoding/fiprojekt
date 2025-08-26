package de.brights.rechnungsgenerator.services;

import de.brights.rechnungsgenerator.dto.Firma;
import de.brights.rechnungsgenerator.dto.User;
import de.brights.rechnungsgenerator.repository.FirmaRepository;
import de.brights.rechnungsgenerator.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class FirmaService {

    private final FirmaRepository firmaRepository;
    private final UserRepository userRepository;

    public FirmaService(FirmaRepository firmaRepository, UserRepository userRepository) {
        this.firmaRepository = firmaRepository;
        this.userRepository = userRepository;
    }

    public Firma createFirma(Firma firma) {
        if (firma.getUser() == null || firma.getUser().getId() == null) {
            throw new IllegalArgumentException("User muss gesetzt sein");
        }

        User user = userRepository.findById(firma.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User nicht gefunden"));

        firma.setUser(user);
        return firmaRepository.save(firma);
    }
}
