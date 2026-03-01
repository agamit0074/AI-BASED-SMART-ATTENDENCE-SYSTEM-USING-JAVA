package com.sa.SmartAttendance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sa.SmartAttendance.entity.ClassRoom;


@Repository
public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {
}

