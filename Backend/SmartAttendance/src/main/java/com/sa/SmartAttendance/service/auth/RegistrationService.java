package com.sa.SmartAttendance.service.auth;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sa.SmartAttendance.dto.StudentRegistrationRequest;
import com.sa.SmartAttendance.entity.RegistrationToken;
import com.sa.SmartAttendance.entity.Student;
import com.sa.SmartAttendance.entity.User;
import com.sa.SmartAttendance.exception.AlreadyRegisteredException;
import com.sa.SmartAttendance.exception.ResourceNotFoundException;
import com.sa.SmartAttendance.exception.TokenExpiredException;
import com.sa.SmartAttendance.repository.RegistrationTokenRepository;
import com.sa.SmartAttendance.repository.StudentRepository;
import com.sa.SmartAttendance.repository.UserRepository;
import com.sa.SmartAttendance.security.RecaptchaService;

@Service
public class RegistrationService {

	@Autowired
	private RegistrationTokenRepository tokenRepo;

	@Autowired
	private StudentRepository studentRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private BCryptPasswordEncoder encoder;
	
	@Autowired
	private RecaptchaService recaptchaService;


	@Transactional
	public String registerStudent(StudentRegistrationRequest request,
	                               MultipartFile profilePic) {
		
		if (!recaptchaService.verify(request.getRecaptchaToken())) {
		    throw new RuntimeException("reCAPTCHA verification failed");
		}


	    RegistrationToken token = tokenRepo.findByToken(request.getToken())
	            .orElseThrow(() ->
	                new ResourceNotFoundException("Invalid registration token"));

	    if (token.isUsed())
	        throw new AlreadyRegisteredException("Already registered");

	    if (token.getExpiryTime().isBefore(LocalDateTime.now()))
	        throw new TokenExpiredException("Token expired");

	    Student student = studentRepo.findByEmail(token.getEmail())
	            .orElseThrow(() -> new RuntimeException("Student not invited"));

	    student.setTitle(request.getTitle());
	    student.setFirstName(request.getFirstName());
	    student.setMiddleName(request.getMiddleName());
	    student.setLastName(request.getLastName());
	    student.setDob(LocalDate.parse(request.getDob()));
	    student.setGender(request.getGender());
	    student.setRollNo(request.getRollNo());
	    student.setMobile(request.getMobile());
	    student.setStatus("ACTIVE");

	    studentRepo.save(student);


	    try {
	        student.setProfilePic(profilePic.getBytes());
	    } catch (IOException e) {
	        throw new RuntimeException("Failed to upload profile picture");
	    }

	    studentRepo.save(student);

	    User user = new User();
	    user.setEmail(token.getEmail());
	    user.setPassword(encoder.encode(request.getPassword()));
	    user.setRole("STUDENT");
	    user.setEnabled(true);

	    userRepo.save(user);

	    token.setUsed(true);
	    tokenRepo.save(token);

	    return "Registration successful";
	}


	public String validateToken(String token) {
		 RegistrationToken regToken = tokenRepo.findByToken(token)
		            .orElseThrow(() -> 
		                new ResourceNotFoundException("Invalid registration link"));

		    if (regToken.isUsed()) {
		        throw new AlreadyRegisteredException("You are already registered");
		    }

		    if (regToken.getExpiryTime().isBefore(LocalDateTime.now())) {
		        throw new TokenExpiredException("Registration link expired");
		    }

		    return regToken.getEmail();
	}
}
