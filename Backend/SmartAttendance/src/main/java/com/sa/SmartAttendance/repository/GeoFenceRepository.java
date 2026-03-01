package com.sa.SmartAttendance.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sa.SmartAttendance.entity.GeoFence;

public interface GeoFenceRepository extends JpaRepository<GeoFence, Long> {

    Optional<GeoFence> findByActiveTrue();
}

