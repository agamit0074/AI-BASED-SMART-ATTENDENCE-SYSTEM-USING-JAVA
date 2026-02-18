package com.sa.SmartAttendance.security;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RecaptchaService {

    @Value("${recaptcha.secret}")
    private String secret;

    private static final String VERIFY_URL =
            "https://www.google.com/recaptcha/api/siteverify";

    public boolean verify(String recaptchaResponse) {

        RestTemplate restTemplate = new RestTemplate();

        String url = VERIFY_URL +
                "?secret=" + secret +
                "&response=" + recaptchaResponse;

        Map<String, Object> response =
                restTemplate.postForObject(url, null, Map.class);

        if (response == null) return false;

        return Boolean.TRUE.equals(response.get("success"));
    }
}
