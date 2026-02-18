package com.sa.SmartAttendance.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sa.SmartAttendance.dto.LoginRequest;
import com.sa.SmartAttendance.dto.LoginResponse;
import com.sa.SmartAttendance.dto.StudentRegistrationRequest;
import com.sa.SmartAttendance.service.auth.AuthService;
import com.sa.SmartAttendance.service.auth.RegistrationService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	private AuthService authService;

	@Autowired
	private RegistrationService registrationService;

	@GetMapping("/validate-registration")
	public ResponseEntity<?> validateRegistration(@RequestParam String token) {
		return ResponseEntity.ok(registrationService.validateToken(token));
	}

	@PostMapping("/login")
	public LoginResponse login(@RequestBody LoginRequest request) {
		return authService.login(request);
	}

	@PostMapping("/register-student")
	public ResponseEntity<?> registerStudent(@RequestPart("data") StudentRegistrationRequest request,
			@RequestPart("profilePic") MultipartFile file) throws Exception {

		String msg = registrationService.registerStudent(request, file);

		return ResponseEntity.ok(msg);
	}
}
