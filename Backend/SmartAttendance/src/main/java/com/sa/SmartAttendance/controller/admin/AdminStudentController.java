package com.sa.SmartAttendance.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sa.SmartAttendance.dto.DashboardResponse;
import com.sa.SmartAttendance.dto.StudentInviteRequest;
import com.sa.SmartAttendance.dto.StudentPageResponse;
import com.sa.SmartAttendance.service.admin.AdminService;
import com.sa.SmartAttendance.service.admin.AdminStudentService;
import com.sa.SmartAttendance.service.admin.StudentInviteService;

@RestController
@RequestMapping("/api/admin/students")
public class AdminStudentController {

	@Autowired
	private StudentInviteService studentService;

	@Autowired
	private AdminService adminService;

	@Autowired
	private AdminStudentService service;

	@PostMapping("/invite")
	public String invite(@RequestBody StudentInviteRequest req) {
		studentService.inviteStudent(req);
		return "Registration link sent";
	}

	@GetMapping("/dashboard")
	public DashboardResponse getDashboard() {
		return adminService.getDashboardStats();
	}

	@GetMapping
	public StudentPageResponse getStudents(@RequestParam(defaultValue = "") String search,
			@RequestParam(defaultValue = "0") int page) {
		return service.getStudents(search, page);
	}

	@DeleteMapping("/{email}")
	public void deleteStudent(@PathVariable String email) {
		service.deleteStudent(email);
	}

	@PutMapping("/update-email")
	public void updateEmail(@RequestParam String oldEmail, @RequestParam String newEmail) {
		service.updateEmail(oldEmail, newEmail);
	}

}
