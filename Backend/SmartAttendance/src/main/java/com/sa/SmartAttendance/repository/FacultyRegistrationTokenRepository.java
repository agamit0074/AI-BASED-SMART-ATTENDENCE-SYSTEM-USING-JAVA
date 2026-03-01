package com.sa.SmartAttendance.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sa.SmartAttendance.entity.FacultyRegistrationToken;

public interface FacultyRegistrationTokenRepository  extends JpaRepository<FacultyRegistrationToken, Long> {
	Optional<FacultyRegistrationToken> findByToken(String token);
}
