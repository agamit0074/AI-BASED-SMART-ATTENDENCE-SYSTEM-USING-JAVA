package com.sa.SmartAttendance.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sa.SmartAttendance.dto.FacultyInviteRequest;
import com.sa.SmartAttendance.service.admin.FacultyInviteService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/admin/faculty")
public class AdminFacultyController {

	@Autowired
	private FacultyInviteService inviteService;

	@PostMapping("/invite")
	public ResponseEntity<?> invite(@RequestBody FacultyInviteRequest request) {
		return ResponseEntity.ok(inviteService.sendInvite(request));
	}

}
