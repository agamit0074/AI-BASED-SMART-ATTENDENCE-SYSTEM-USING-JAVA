package com.sa.SmartAttendance.dto;

public record FacultyRegistrationRequest(String token, String title, String firstName, String middleName,
		String lastName, String dob, String gender, String mobile, String employeeId, String qualification,
		String department, String designation, String password, String recaptchaToken) {

}
