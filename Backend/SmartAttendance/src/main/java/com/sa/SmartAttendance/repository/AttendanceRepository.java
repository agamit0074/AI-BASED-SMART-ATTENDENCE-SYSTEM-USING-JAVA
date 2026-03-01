package com.sa.SmartAttendance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sa.SmartAttendance.entity.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    boolean existsByStudentIdAndSessionId(Long studentId, Long sessionId);
}


