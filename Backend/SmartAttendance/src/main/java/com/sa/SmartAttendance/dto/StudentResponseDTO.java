package com.sa.SmartAttendance.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.sa.SmartAttendance.entity.Student;

public class StudentResponseDTO {

    private String name;
    private String email;
    private String className;
    private List<String> subjects;
    private String status;

    public StudentResponseDTO(Student student) {

        // Full Name
        this.name = student.getFirstName() + " " +
                (student.getMiddleName() != null ? student.getMiddleName() + " " : "") +
                student.getLastName();

        this.email = student.getEmail();

        // Class Name
        if (student.getClassRoom() != null) {

            this.className = student.getClassRoom().getClassName();

            // Subjects from ClassRoom
            if (student.getClassRoom().getSubjects() != null) {
                this.subjects = student.getClassRoom()
                        .getSubjects()
                        .stream()
                        .map(subject -> subject.getName())
                        .collect(Collectors.toList());
            }

        } else {
            this.className = "-";
        }

        this.status = student.getStatus();
    }

    // GETTERS

    public String getName() { return name; }

    public String getEmail() { return email; }

    public String getClassName() { return className; }

    public List<String> getSubjects() { return subjects; }

    public String getStatus() { return status; }
}
