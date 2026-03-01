package com.sa.SmartAttendance.service.admin;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.sa.SmartAttendance.dto.StudentPageResponse;
import com.sa.SmartAttendance.dto.StudentResponseDTO;
import com.sa.SmartAttendance.entity.Student;
import com.sa.SmartAttendance.repository.StudentRepository;

@Service
public class AdminStudentService {
	@Autowired
	private  StudentRepository studentRepository;

    public StudentPageResponse getStudents(String search, int page) {

        PageRequest pageable = PageRequest.of(page, 10);

        Page<Student> studentPage;

        if(search == null || search.isBlank()) {
            studentPage = studentRepository.findAll(pageable);
        } else {
            studentPage = studentRepository
                    .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                            search, search, pageable);
        }

        return new StudentPageResponse(
                studentPage.getContent()
                        .stream()
                        .map(StudentResponseDTO::new)
                        .collect(Collectors.toList()),
                studentPage.getNumber(),
                studentPage.getTotalPages(),
                studentPage.getTotalElements()
        );
    }

    public void deleteStudent(String email) {
        studentRepository.deleteByEmail(email);
    }

    public void updateEmail(String oldEmail, String newEmail) {

        Student student = studentRepository.findByEmail(oldEmail).get();

        if(student == null)
            throw new RuntimeException("Student not found");

        if(studentRepository.existsByEmail(newEmail))
            throw new RuntimeException("Email already exists");

        student.setEmail(newEmail);
        studentRepository.save(student);
    }
}
