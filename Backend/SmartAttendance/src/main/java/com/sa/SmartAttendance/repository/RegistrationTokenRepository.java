package com.sa.SmartAttendance.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sa.SmartAttendance.entity.RegistrationToken;

import java.util.Optional;

public interface RegistrationTokenRepository
        extends JpaRepository<RegistrationToken, Long> {

    Optional<RegistrationToken> findByToken(String token);

    void deleteByEmail(String email);
}

