package com.sa.SmartAttendance.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sa.SmartAttendance.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{
	//Java 8 Feature 
	Optional<User> findByEmail(String email);
	
	@Modifying
	@Query("update User u set u.email = :newEmail where u.email = :oldEmail")
	void updateEmail(String oldEmail, String newEmail);

	void deleteByEmail(String email);
}
