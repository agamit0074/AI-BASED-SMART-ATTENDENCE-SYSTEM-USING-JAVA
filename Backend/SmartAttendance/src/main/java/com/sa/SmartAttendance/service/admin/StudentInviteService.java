package com.sa.SmartAttendance.service.admin;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sa.SmartAttendance.dto.StudentInviteRequest;
import com.sa.SmartAttendance.entity.RegistrationToken;
import com.sa.SmartAttendance.entity.Student;
import com.sa.SmartAttendance.repository.RegistrationTokenRepository;
import com.sa.SmartAttendance.repository.StudentRepository;
import com.sa.SmartAttendance.service.mail.MailService;
import com.sa.SmartAttendance.util.TokenGenerator;

@Service
public class StudentInviteService {

	@Autowired
    private StudentRepository studentRepo;
	@Autowired
    private RegistrationTokenRepository tokenRepo;
	@Autowired
    private MailService mailService;

    public void inviteStudent(StudentInviteRequest req) {

        Student s = new Student();
        s.setFirstName(req.getName());
        s.setEmail(req.getEmail());
        s.setMobile(req.getMobile());
        s.setStatus("INVITED");
        studentRepo.save(s);

        RegistrationToken token = new RegistrationToken();
        token.setToken(TokenGenerator.generate());
        token.setEmail(req.getEmail());
        token.setExpiryTime(LocalDateTime.now().plusHours(24));
        token.setUsed(false);
        tokenRepo.save(token);

        String link =
          "http://localhost:5500/register.html?token=" + token.getToken();

        mailService.sendHtmlInvite(req.getEmail(),req.getName(), link);
    }
}

