package com.sa.SmartAttendance.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sa.SmartAttendance.entity.AttendanceSession;


@Repository
public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {

    Optional<AttendanceSession> findByTimetableIdAndSessionDateAndActiveTrue(
            Long timetableId,
            LocalDate date
    );
}

