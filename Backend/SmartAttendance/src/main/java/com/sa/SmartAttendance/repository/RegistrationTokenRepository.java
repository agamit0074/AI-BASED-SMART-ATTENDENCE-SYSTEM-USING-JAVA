package com.sa.SmartAttendance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sa.SmartAttendance.entity.RegistrationToken;

import java.util.Optional;

@Repository
public interface RegistrationTokenRepository
        extends JpaRepository<RegistrationToken, Long> {

    Optional<RegistrationToken> findByToken(String token);

    void deleteByEmail(String email);
}

