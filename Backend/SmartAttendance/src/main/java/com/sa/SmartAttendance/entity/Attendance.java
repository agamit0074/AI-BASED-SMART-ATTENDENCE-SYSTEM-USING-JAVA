package com.sa.SmartAttendance.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private String status; // PRESENT / REJECTED

    private double latitude;
    private double longitude;

    private boolean geoVerified;
    private boolean faceVerified;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private AttendanceSession session;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public boolean isGeoVerified() {
		return geoVerified;
	}

	public void setGeoVerified(boolean geoVerified) {
		this.geoVerified = geoVerified;
	}

	public boolean isFaceVerified() {
		return faceVerified;
	}

	public void setFaceVerified(boolean faceVerified) {
		this.faceVerified = faceVerified;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}

	public AttendanceSession getSession() {
		return session;
	}

	public void setSession(AttendanceSession session) {
		this.session = session;
	}
}
