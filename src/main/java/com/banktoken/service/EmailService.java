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
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("23b01a12c6@svecw.edu.in"); // change to your email
        mailSender.send(message);
    }
	
	public void sendTokenConfirmation(String toEmail, String tokenNumber) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Bank Token Confirmation");
        message.setText("Your token has been booked successfully.\n\nToken Number: " + tokenNumber +
                        "\nPlease arrive at the bank on time.\n\nThank you!");
        message.setFrom("23b01a12c6@svecw.edu.in");

        mailSender.send(message);
    }
}
