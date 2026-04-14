package com.banktoken.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.banktoken.util.JwtUtil;
import com.banktoken.dto.UserProfileDTO;
import com.banktoken.dto.UpdateProfileDTO;
import com.banktoken.dto.ChangePasswordDTO;


import jakarta.annotation.PostConstruct;

import com.banktoken.dto.SignupRequestDto;
//import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import com.banktoken.model.*;
import com.banktoken.service.BranchService;
import com.banktoken.service.*;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {
	private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

	
	@Autowired
	private UserService userService;
	
	@Autowired
	private RecaptchaService recaptchaService;
	
	@Autowired
	private AccountService accountService;

	@Autowired
	private TokenService tokenService;
	
	@Autowired
	private BranchService branchService;
	
	@Autowired
	private BankService bankService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private AuthenticationManager authenticationManager;

	
	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody SignupRequestDto dto) {
		System.out.println("Received DTO:");
		System.out.println("Name: " + dto.getName());
		System.out.println("Account Number: " + dto.getAccountNumber());
		System.out.println("Bank ID: " + dto.getBankId());
		System.out.println("Branch ID: " + dto.getBranchId());
		 boolean captchaVerified = recaptchaService.verifyToken(dto.getRecaptchaToken());
		    if (!captchaVerified) {
		        return ResponseEntity.badRequest().body("Invalid reCAPTCHA. Please try again.");
		    }
		 try {
		
		Optional<Bank> bankOpt = bankService.findById(dto.getBankId());
        if (bankOpt.isEmpty()) {
        	return ResponseEntity.badRequest().body("Selected bank not found");
        }
        Bank bank = bankOpt.get();
        
		if (!dto.getPassword().equals(dto.getConfirmPassword())) {
	        return ResponseEntity.badRequest().body("Passwords do not match");
	    }

	    Optional<Account> accountOpt = accountService.getAccountByNumber(dto.getAccountNumber());
	    if (accountOpt.isEmpty()) {
	        return ResponseEntity.badRequest().body("Invalid account number for selected bank");
	    }
	   
	    Account account = accountOpt.get();
	    if (account.getUser() != null) {
	        return ResponseEntity.badRequest().body("This account is already linked to another user");
	    }
	    if (!account.getBank().getId().equals(bank.getId())) {
	        return ResponseEntity.badRequest().body("Account does not belong to the selected bank");
	    }

	    // 4. Validate branch
	    Optional<Branch> branchOpt = branchService.findById(dto.getBranchId());
	    if (branchOpt.isEmpty()) {
	        return ResponseEntity.badRequest().body("Selected branch not found for the chosen bank");
	    }
	    
	    Branch branch = branchOpt.get();

	    // Hash password
	    String hashedPassword = passwordEncoder.encode(dto.getPassword());

	    // Create and save user
	    User user = new User();
	    user.setName(dto.getName());
	    user.setEmail(dto.getEmail());
	    user.setPassword(hashedPassword);
	    user.setAccountNumber(dto.getAccountNumber());
	    user.setPhoneNumber(dto.getPhoneNumber());
	    user.setBranch(branch);
	    user.setRole(Role.USER);
	    System.out.println("User to be saved: " + user);


	    userService.saveUser(user);
	    account.setUser(user);
	    accountService.saveAccount(account);

	    return ResponseEntity.ok("User Registered Successfully");
		}
		catch (Exception ex) {
		        
		        ex.printStackTrace();                      
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		                             .body("Server error: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
		}
	}
	
	//login a user
	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
		 String email = loginRequest.get("email");
		 String password = loginRequest.get("password");
		 
		 try {
			    LOGGER.info("Login attempt for email={}", email);
				// Authenticate credentials (will throw BadCredentialsException if invalid)
				authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(email, password)
				);

				// load user to get id and role
				User user = userService.findByEmail(email).orElseThrow();

				// Generate JWT using your JwtUtil
//				String token = jwtUtil.generateToken(user.getEmail()); // if you extend JwtUtil, you can include userId/role as claims
				String accessToken = jwtUtil.generateToken(user.getEmail());
		        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

		        // Create httpOnly cookie for refresh token
		        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
		                .httpOnly(true)
		                .secure(false)          // ❗ set true in production (requires HTTPS)
		                .path("/")      // cookie sent only to /api/auth/*
		                .maxAge(7 * 24 * 60 * 60) // 7 days
		                .sameSite("Lax")
		                .build();
		        
				LOGGER.info("Login success: email={}, id={}", email, user.getId());
				
//				return ResponseEntity.ok(Map.of(
//					"token", token,
//					"userId", user.getId(),
//					"role", user.getRole()
//				));
				return ResponseEntity.ok()
		                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
		                .body(Map.of(
		                        "accessToken", accessToken,
		                        "userId", user.getId(),
		                        "role", user.getRole()
		                ));

			} catch (BadCredentialsException ex) {
				LOGGER.warn("Bad credentials for email={}", email);
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
			}
		 	catch (Exception ex) {
		        LOGGER.error("Login error for email=" + email, ex); // full stacktrace goes to log
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		                .body(Map.of("error", "Login failed due to server error", "details", ex.getClass().getSimpleName()));
		    }
	
	}
	
	@PostMapping("/auth/refresh")
	public ResponseEntity<?> refreshAccessToken(
	        @CookieValue(name = "refreshToken", required = false) String refreshToken) {

	    if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body(Map.of("error", "Expired/invalid refresh token. Please login again."));
	    }

	    String email = jwtUtil.extractUsername(refreshToken);
	    String newAccessToken = jwtUtil.generateAccessToken(email);

	    return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
	}

	
	@GetMapping("/{email}")
	public ResponseEntity<User> getUser(@PathVariable String email){
		Optional<User> user =userService.findByEmail(email);
		return user.map(ResponseEntity::ok)
	               .orElseGet(() -> ResponseEntity.notFound().build());
	}
	
	@GetMapping("/me")
	public ResponseEntity<?> getCurrentUser(Authentication authentication) {
	    if (authentication == null || !authentication.isAuthenticated()) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }
	    String email = authentication.getName();
	    Optional<User> user = userService.findByEmail(email);

	    if (user.isPresent()) {
	        return ResponseEntity.ok(user.get());
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }
	}

	
//	@PutMapping("/update/{email}")
//	public ResponseEntity<User> updateUser(@PathVariable String email,@RequestBody User updatedUser){
//		User user = userService.updateUserProfile(email, updatedUser);
//		return user!=null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
//	}
	
	@GetMapping("/id/{id}")
	public ResponseEntity<User> getUserById(@PathVariable Long id) {
	    return userService.findById(id)
	           .map(ResponseEntity::ok)
	           .orElse(ResponseEntity.notFound().build());
	}

	@PostConstruct
	public void testEncoder() {
	    System.out.println("PasswordEncoder instance: " + passwordEncoder.getClass().getName());
	}
	
	@DeleteMapping("/clear-history/{userId}")
    public ResponseEntity<String> clearHistory(@PathVariable Long userId) {
        tokenService.clearUserHistory(userId);
        return ResponseEntity.ok("User token history cleared successfully!");
    }
	
	@GetMapping("/profile/{id}")
	public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable Long id) {

	    User user = userService.findById(id)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    UserProfileDTO dto = new UserProfileDTO(
	            user.getName(),
	            user.getAccountNumber(),
	            user.getBank().getName(),
	            user.getBranch().getName(),
	            user.getEmail(),
	            user.getPhoneNumber()
	    );

	    return ResponseEntity.ok(dto);
	}
	
	@PutMapping("/profile/{id}")
	public ResponseEntity<String> updateUserProfile(
	        @PathVariable Long id,
	        @RequestBody UpdateProfileDTO dto) {

	    User user = userService.findById(id)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    user.setEmail(dto.getEmail());
	    user.setPhoneNumber(dto.getPhoneNumber());

	    userService.saveUser(user);

	    return ResponseEntity.ok("Profile updated successfully");
	}


}
