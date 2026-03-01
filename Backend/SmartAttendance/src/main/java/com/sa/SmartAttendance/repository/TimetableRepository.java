package com.sa.SmartAttendance.repository;

import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sa.SmartAttendance.entity.Timetable;


@Repository
public interface TimetableRepository extends JpaRepository<Timetable, Long> {

    List<Timetable> findByFacultyId(Long facultyId);

    @Query("""
           SELECT t FROM Timetable t
           WHERE t.dayOfWeek = :day
           AND :time BETWEEN t.startTime AND t.endTime
           """)
    List<Timetable> findCurrentLecture(
            @Param("day") String day,
            @Param("time") LocalTime time
    );
}

