package com.sa.SmartAttendance.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sa.SmartAttendance.entity.Faculty;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty,Long> {
	boolean existsByEmail(String email);

    Optional<Faculty> findByEmail(String email);
}
