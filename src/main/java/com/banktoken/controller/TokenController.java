package com.banktoken.controller;

import java.util.ArrayList;
import java.util.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.banktoken.dto.BranchServiceCountDTO;
import com.banktoken.dto.SlotDTO;
import com.banktoken.dto.TokenRequest;
import com.banktoken.dto.TokenSummaryDTO;
import com.banktoken.model.Token;
import com.banktoken.repository.TokenRepository;
import com.banktoken.model.*;
import com.banktoken.service.UserService;

//import io.jsonwebtoken.lang.Collections;

import com.banktoken.service.EmailService;

import com.banktoken.service.TokenService;


@RestController
@RequestMapping("/api/tokens")
public class TokenController {
	
	
	
	@Autowired 
	private TokenService tokenService;
	
	@Autowired
    private TokenRepository tokenRepository;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private EmailService emailService;
	
	private Map<Long, String> otpStore = new HashMap<>();

	//to book a token
	@PostMapping("/book")
	public ResponseEntity<Token> booktoken(@RequestBody TokenRequest request) {
		Token token = tokenService.bookToken(request);
		
		 User user = userService.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

		String userEmail = user.getEmail();
		String subject = "Token Booking confirmation";
		String body ="Hi " + user.getName() + ",\n\nYour token has been booked successfully!\n\nToken ID:"+ token.getTokenNumber() + "\nSlot: " +
		 token.getSlotTime() + "\nLocation: " +  token.getBranch() +"\nPlease arrive at least 10 minutes before your slot time to ensure smooth service.\n\nThank you!";
		
		try {
			emailService.sendBookingEmail(userEmail, subject, body);
		}catch(Exception e) {
			System.out.print("Email sending failed: " + e.getMessage());
		}
		
		return ResponseEntity.ok(token);
	}
	
	//to see the tokens of a particular user
	@GetMapping("/user/{userId}")
	public List<Token> getTokensByUser(@PathVariable Long userId,@RequestParam(required = false) String date){
		if(date!=null && !date.isEmpty()) {
			return tokenService.getTokensByUserAndDate(userId,date);
		}
		else {
			return tokenService.getTokensByUser(userId);
		}
	}
	
	//to filter the tokens based on requirements
	@GetMapping("/filter")
	public ResponseEntity<List<Token>> filterTokens(
			@RequestParam Long branchId,
			@RequestParam Long serviceId,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime){
		List<Token> tokens = tokenService.filterTokens(branchId, serviceId, startTime, endTime);;
		return ResponseEntity.ok(tokens);
	}
	
	//to see the status of a particular token of a user
	@PutMapping("/{tokenId}/status")
	@PreAuthorize("hasRole('ADMIN')") 
	public ResponseEntity<String> updateTokenStatus(
			@PathVariable Long tokenId,
			@RequestParam TokenStatus newStatus){
		
		Optional<Token> optionalToken = tokenService.findById(tokenId);
		if(optionalToken.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Token not found");
		}
		
		Token token = optionalToken.get();
		token.setStatus(newStatus);
		tokenService.save(token);
		
		if(newStatus == TokenStatus.SERVED) {
	        String subject = "Token Process Completed";
	        String body = "Dear " + token.getUser().getName() + ",\n\n" +
	                      "Your token " + token.getId() + " has been completed successfully.\n\n" +
	                      "Thank you for visiting our bank!";
	        emailService.sendBookingEmail(token.getUser().getEmail(), subject, body);
	    }
		
		return ResponseEntity.ok("Token status updated to "+newStatus);
	}
	
	//to get summary of todays token
//	@GetMapping("/summary/today")
//	public Map<String, Long> getTodaySummary(){
////		return ResponseEntity.ok(tokenService.getTodayTokenSummary());
//		Map<String, Long> summary = new HashMap<>();
//        summary.put("totalTokens", tokenRepository.getTotalTokens());
//        summary.put("bookedTokens", tokenRepository.getBookedTokens());
//        summary.put("completedTokens", tokenRepository.getCompletedTokens());
//        summary.put("processingTokens", tokenRepository.getProcessingTokens());
//        summary.put("cancelledTokens", tokenRepository.getCancelledTokens());
//        summary.put("expiredTokens", tokenRepository.getExpiredTokens());
//        
//        return summary;
//	}
	@GetMapping("/summary/today")
	public Map<String, Long> getTodaySummary(org.springframework.security.core.Authentication authentication) {

	    User user = userService.findByEmail(authentication.getName()).orElseThrow();
	    Long bankId = user.getBank().getId();

	    Map<String, Long> summary = new HashMap<>();

	    summary.put("totalTokens", tokenRepository.getTotalTokensByBank(bankId));
	    summary.put("bookedTokens", tokenRepository.getBookedTokensByBank(bankId));
	    summary.put("completedTokens", tokenRepository.getCompletedTokensByBank(bankId));
	    summary.put("processingTokens", tokenRepository.getProcessingTokensByBank(bankId));
	    summary.put("cancelledTokens", tokenRepository.getCancelledTokensByBank(bankId));
	    summary.put("expiredTokens", tokenRepository.getExpiredTokensByBank(bankId));

	    return summary;
	}
	
	
//	@GetMapping("/today")
//	@PreAuthorize("hasRole('ADMIN')")
//	public List<Token> getTodayTokens() {
//	    return tokenService.getTodayTokens(); 
//	}
	@GetMapping("/today")
	@PreAuthorize("hasRole('ADMIN')")
	public List<Token> getTodayTokens(org.springframework.security.core.Authentication authentication) {

	    User user = userService.findByEmail(authentication.getName()).orElseThrow();
	    Long bankId = user.getBank().getId();

	    return tokenService.getTodayTokens(bankId); // ✅ FIXED
	}
	
//	@GetMapping("/count-by-branch")
//	@PreAuthorize("hasRole('ADMIN')")
//	public ResponseEntity<List<BranchServiceCountDTO>> countByBranch(@RequestParam(required=false) String month) {
//		if(month!=null && !month.isEmpty()) {
//			return ResponseEntity.ok(tokenService.getTokenCountByBranchForMonth(month));
//		}
//	    return ResponseEntity.ok(tokenService.getTokenCountByBranch());
//	}
	@GetMapping("/count-by-branch")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<BranchServiceCountDTO>> countByBranch(
	        @RequestParam(required = false) String month,
	        org.springframework.security.core.Authentication authentication) {

	    User user = userService.findByEmail(authentication.getName()).orElseThrow();
	    Long bankId = user.getBank().getId();

	    if (month != null && !month.isEmpty()) {
	        return ResponseEntity.ok(tokenService.getTokenCountByBranchForMonth(month, bankId));
	    }

	    return ResponseEntity.ok(tokenService.getTokenCountByBranch(bankId));
	}

//	@GetMapping("/count-by-service")
//	@PreAuthorize("hasRole('ADMIN')")
//	public ResponseEntity<List<BranchServiceCountDTO>> countByService(@RequestParam(required=false) String month) {
//		if (month != null && !month.isEmpty()) {
//            return ResponseEntity.ok(tokenService.getTokenCountByServiceForMonth(month));
//        }
//	    return ResponseEntity.ok(tokenService.getTokenCountByService());
//	}
//	
	@GetMapping("/count-by-service")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<BranchServiceCountDTO>> countByService(
	        @RequestParam(required = false) String month,
	        org.springframework.security.core.Authentication authentication) {

	    User user = userService.findByEmail(authentication.getName()).orElseThrow();
	    Long bankId = user.getBank().getId();

	    if (month != null && !month.isEmpty()) {
	        return ResponseEntity.ok(tokenService.getTokenCountByServiceForMonth(month, bankId));
	    }

	    return ResponseEntity.ok(tokenService.getTokenCountByService(bankId));
	}
	
	@GetMapping("/slots")
    public ResponseEntity<List<SlotDTO>> getSlots(@RequestParam String date,@RequestParam Long serviceId) {
        LocalDate localDate = LocalDate.parse(date);
        List<SlotDTO> slots = tokenService.getSlotsForDateAndService(localDate, serviceId);
        return ResponseEntity.ok(slots);
    }
	
	@PutMapping("/{id}/cancel")
	public ResponseEntity<Token> cancelToken(@PathVariable Long id) {
	    Token token = tokenRepository.findById(id).orElseThrow();

	    if(token.getStatus() == TokenStatus.BOOKED) {
	        token.setStatus(TokenStatus.CANCELLED);
	        
//	        Slot slot = token.getSlot();
//	        if (slot != null) {
//	            slot.setAvailable(true); // or increment availableSeats if you support multiple users per slot
//	            slotRepository.save(slot);
//	        }
	        Token updated = tokenRepository.save(token);

	        // Send cancellation email
//	        String subject = "Token Cancelled";
//	        String body = "Dear " + token.getUser().getName() + ",\n\n" +
//	                      "Your token " + token.getId() + " has been cancelled.\n\n" +
//	                      "If this was a mistake, please book again.";
//	        emailService.sendBookingEmail(token.getUser().getEmail(), subject, body);

	        return ResponseEntity.ok(updated);
	    }
	    return ResponseEntity.badRequest().build();
	}

	
	 @PostMapping("/send-otp")
	 public ResponseEntity<String> sendOtp(@RequestParam Long userId) {
	        User user = userService.findById(userId)
	                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

	        String otp = String.valueOf(100000 + new Random().nextInt(900000)); // 6-digit OTP
	        otpStore.put(userId, otp);

	        String subject = "Token Booking OTP Verification";
	        String body = "Hi " + user.getName() + ",\n\nYour OTP for token booking is: " + otp + "\n\nThis OTP is valid for 5 minutes.";

	        emailService.sendBookingEmail(user.getEmail(), subject, body);

	        return ResponseEntity.ok("OTP sent successfully to " + user.getEmail());
	    }
	    @PostMapping("/verify-otp")
	    public ResponseEntity<?> verifyOtp(@RequestParam Long userId, @RequestParam String otp, @RequestBody TokenRequest request) {
	        String savedOtp = otpStore.get(userId);

	        if (savedOtp == null) {
	            return ResponseEntity.badRequest().body("OTP not generated. Please request a new one.");
	        }

	        if (!savedOtp.equals(otp)) {
	            return ResponseEntity.badRequest().body("Invalid OTP. Please try again.");
	        }

	        // OTP verified → remove from store
	        otpStore.remove(userId);

	        // Proceed to book the token
	        Token token = tokenService.bookToken(request);

	        // Send booking confirmation email
	        User user = userService.findById(request.getUserId())
	                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));
	        String subject = "Token Booking Confirmation";
	        String body = "Hi " + user.getName() + ",\n\nYour token has been booked successfully!\n\nToken ID: " + token.getTokenNumber();

	        try {
	            emailService.sendBookingEmail(user.getEmail(), subject, body);
	        } catch (Exception e) {
	            System.out.println("Email sending failed: " + e.getMessage());
	        }

	        return ResponseEntity.ok(token);
	    }
		
}
