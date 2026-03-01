package com.sa.SmartAttendance.service.admin;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sa.SmartAttendance.dto.FacultyInviteRequest;
import com.sa.SmartAttendance.entity.Faculty;
import com.sa.SmartAttendance.entity.FacultyRegistrationToken;
import com.sa.SmartAttendance.exception.AlreadyRegisteredException;
import com.sa.SmartAttendance.repository.FacultyRegistrationTokenRepository;
import com.sa.SmartAttendance.repository.FacultyRepository;
import com.sa.SmartAttendance.service.mail.FacultyMailService;
import com.sa.SmartAttendance.util.TokenGenerator;

@Service
public class FacultyInviteService {
	@Autowired
	private FacultyRepository facultyRepo;
	
	@Autowired
	private FacultyRegistrationTokenRepository tokenRepo;
	
	@Autowired
    private FacultyMailService mailService;
	
	public String sendInvite(FacultyInviteRequest request) {

        if (facultyRepo.existsByEmail(request.email()))
            throw new AlreadyRegisteredException("Faculty already invited or registered");

        Faculty faculty = new Faculty();
        faculty.setFirstName(request.name());
        faculty.setEmail(request.email());
        faculty.setStatus("INVITED");

        facultyRepo.save(faculty);

        String token = TokenGenerator.generate();

        FacultyRegistrationToken regToken = new FacultyRegistrationToken();
        regToken.setToken(token);
        regToken.setEmail(request.email());
        regToken.setUsed(false);
        regToken.setExpiryTime(LocalDateTime.now().plusHours(24));

        tokenRepo.save(regToken);

        String link =
            "http://localhost:5500/faculty_registration.html?token=" + token;

        mailService.sendHtmlInvite(request.email(),request.name(), link);

        return "Invite sent successfully";
    }
	
}
