package com.banktoken.service;
import java.util.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RecaptchaService {
	@Value("${google.recaptcha.secret}")
    private String recaptchaSecret;

    private static final String GOOGLE_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean verifyToken(String token) {
        RestTemplate restTemplate = new RestTemplate();
        String params = "?secret=" + recaptchaSecret + "&response=" + token;
        String verifyUrl = GOOGLE_VERIFY_URL + params;

        Map<String, Object> response = restTemplate.postForObject(verifyUrl, null, Map.class);
        if (response == null) return false;

        return (Boolean) response.get("success");
    }
}
