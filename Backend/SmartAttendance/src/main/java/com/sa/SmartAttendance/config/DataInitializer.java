package com.sa.SmartAttendance.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.sa.SmartAttendance.entity.User;
import com.sa.SmartAttendance.repository.UserRepository;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        String adminEmail = "faculty@smartattendance.com";

        // Check if admin already exists
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            System.out.println("Student already exists....,\n skipping creation......");
            return;
        }

        User admin = new User();
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode("faculty@123"));
        admin.setRole("FACULTY");
        admin.setEnabled(true);

        userRepository.save(admin);
        System.out.println("==================================");
        System.out.println("Default ADMIN created successfully");
        System.out.println("Email: admin@smartattendance.com");
        System.out.println("Password: admin@123");
        System.out.println("==================================");
    }
}

