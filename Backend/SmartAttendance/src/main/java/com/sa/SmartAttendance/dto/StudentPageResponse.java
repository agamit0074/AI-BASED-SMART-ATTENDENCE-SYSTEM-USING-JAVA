package com.sa.SmartAttendance.dto;

import java.util.List;

public record StudentPageResponse(
		List<StudentResponseDTO> content,
	     int currentPage,
	     int totalPages,
	     long totalElements
) {}
