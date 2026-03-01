package com.sa.SmartAttendance.service.auth;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sa.SmartAttendance.dto.FacultyRegistrationRequest;
import com.sa.SmartAttendance.dto.TokenValidationResponse;
import com.sa.SmartAttendance.entity.Faculty;
import com.sa.SmartAttendance.entity.FacultyRegistrationToken;
import com.sa.SmartAttendance.entity.User;
import com.sa.SmartAttendance.exception.AlreadyRegisteredException;
import com.sa.SmartAttendance.exception.ResourceNotFoundException;
import com.sa.SmartAttendance.exception.TokenExpiredException;
import com.sa.SmartAttendance.repository.FacultyRegistrationTokenRepository;
import com.sa.SmartAttendance.repository.FacultyRepository;
import com.sa.SmartAttendance.repository.UserRepository;
import com.sa.SmartAttendance.security.RecaptchaService;

@Service
public class FacultyRegistrationService {

	@Autowired
	private FacultyRepository facultyRepo;
	@Autowired
	private FacultyRegistrationTokenRepository tokenRepo;
	@Autowired
	private BCryptPasswordEncoder encoder;
	@Autowired
	private RecaptchaService recaptchaService;
	@Autowired
	private UserRepository userRepo;

	public TokenValidationResponse validateToken(String token) {

		FacultyRegistrationToken regToken = tokenRepo.findByToken(token)
				.orElseThrow(() -> new RuntimeException("INVALID"));

		if (regToken.isUsed())
			return new TokenValidationResponse("ALREADY_REGISTERED", null);

		if (regToken.getExpiryTime().isBefore(LocalDateTime.now()))
			return new TokenValidationResponse("EXPIRED", null);

		return new TokenValidationResponse("VALID", regToken.getEmail());
	}

	@Transactional
	public String register(FacultyRegistrationRequest req, MultipartFile profilePic) throws IOException {

		if (!recaptchaService.verify(req.recaptchaToken())) {
		    throw new RuntimeException("reCAPTCHA verification failed");
		}

		FacultyRegistrationToken token = tokenRepo.findByToken(req.token())
				.orElseThrow(() ->
                new ResourceNotFoundException("Invalid registration token"));

		if (token.isUsed())
			throw new AlreadyRegisteredException("Already registered");
		
		if (token.getExpiryTime().isBefore(LocalDateTime.now()))
	        throw new TokenExpiredException("Token expired");

		Faculty faculty = facultyRepo.findByEmail(token.getEmail())
				.orElseThrow(() -> new RuntimeException("Faculty not invited"));

		faculty.setTitle(req.title());
		faculty.setFirstName(req.firstName());
		faculty.setMiddleName(req.middleName());
		faculty.setLastName(req.lastName());
		faculty.setDob(LocalDate.parse(req.dob()));
		faculty.setGender(req.gender());
		faculty.setMobile(req.mobile());
		faculty.setEmployeeId(req.employeeId());
		faculty.setQualification(req.qualification());
		faculty.setDepartment(req.department());
		faculty.setDesignation(req.designation());
		faculty.setStatus("ACTIVE");

		facultyRepo.save(faculty);
		
		try {
			faculty.setProfilePic(profilePic.getBytes());
		}catch (IOException e) {
	        throw new RuntimeException("Failed to upload profile picture");
	    }
		
		facultyRepo.save(faculty);
		
		User user = new User();
	    user.setEmail(token.getEmail());
	    user.setPassword(encoder.encode(req.password()));
	    user.setRole("FACULTY");
	    user.setEnabled(true);

	    userRepo.save(user);

		token.setUsed(true);
		tokenRepo.save(token);
		
		return "Registration successful";
	}

}
