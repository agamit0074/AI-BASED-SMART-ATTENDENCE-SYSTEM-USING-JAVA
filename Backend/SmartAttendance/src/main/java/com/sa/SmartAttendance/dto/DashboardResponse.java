package com.sa.SmartAttendance.dto;

public record DashboardResponse(
        long total,
        long invited,
        long active
) {}
