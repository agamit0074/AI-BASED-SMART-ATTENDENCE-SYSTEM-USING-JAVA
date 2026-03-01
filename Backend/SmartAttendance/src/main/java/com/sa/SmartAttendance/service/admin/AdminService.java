package com.sa.SmartAttendance.service.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sa.SmartAttendance.dto.DashboardResponse;
import com.sa.SmartAttendance.repository.StudentRepository;

@Service
public class AdminService {
	
	@Autowired
    private StudentRepository studentRepository;

    public DashboardResponse getDashboardStats() {

        long total = studentRepository.count();
        long invited = studentRepository.countByStatus("INVITED");
        long active = studentRepository.countByStatus("ACTIVE");

        return new DashboardResponse(total, invited, active);
    }
}