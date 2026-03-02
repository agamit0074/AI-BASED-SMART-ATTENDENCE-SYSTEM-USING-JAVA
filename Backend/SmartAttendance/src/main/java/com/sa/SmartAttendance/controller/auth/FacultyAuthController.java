package com.sa.SmartAttendance.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sa.SmartAttendance.dto.FacultyRegistrationRequest;
import com.sa.SmartAttendance.dto.TokenValidationResponse;
import com.sa.SmartAttendance.service.auth.FacultyRegistrationService;

@RestController
@RequestMapping("/api/auth/faculty")
public class FacultyAuthController {
	
	@Autowired
	private FacultyRegistrationService service;

	    @GetMapping("/validate")
	    public TokenValidationResponse validate(@RequestParam String token) {
	        return service.validateToken(token);
	    }

	    @PostMapping("/register")
	    public void register(
	            @RequestPart("data") FacultyRegistrationRequest request,
	            @RequestPart("profilePic") MultipartFile file)
	            throws Exception {

	        service.register(request, file);
	    }

}
