package com.banktoken.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
	
	@Autowired 
	private JavaMailSender mailSender;
	
	public void sendBookingEmail(String toEmail, String subject, String body) {
		SimpleMailMessage message =new SimpleMailMessage();
		message.setFrom("23b01a12c6@svecw.edu.in");
		message.setTo(toEmail);
		message.setSubject(subject);
		message.setText(body);
		
		mailSender.send(message);
	}
}
