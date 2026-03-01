package com.sa.SmartAttendance.service.student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sa.SmartAttendance.dto.StudentResponseDTO;
import com.sa.SmartAttendance.entity.Student;
import com.sa.SmartAttendance.repository.StudentRepository;
import com.sa.SmartAttendance.repository.UserRepository;

@Service
public class StudentService {
	@Autowired
    private StudentRepository studentRepo;
	@Autowired
    private UserRepository userRepo;

    public void deleteByEmail(String email){

        Student student = studentRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        studentRepo.delete(student);
        userRepo.deleteByEmail(email);
    }
}
