package com.sa.SmartAttendance.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sa.SmartAttendance.dto.StudentInviteRequest;
import com.sa.SmartAttendance.service.admin.StudentInviteService;

@RestController
@RequestMapping("/api/admin/students")
public class AdminStudentController {

	@Autowired
    private StudentInviteService service;

    @PostMapping("/invite")
    public String invite(@RequestBody StudentInviteRequest req) {
        service.inviteStudent(req);
        return "Registration link sent";
    }
}

