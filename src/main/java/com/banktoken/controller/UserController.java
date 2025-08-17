package com.banktoken.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

//import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import com.banktoken.model.User;

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

import jakarta.annotation.PostConstruct;

import com.banktoken.model.Role;
import com.banktoken.service.TokenService;
import com.banktoken.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {
	
	@Autowired
	private UserService userService;

	@Autowired
	private TokenService tokenService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtUtil jwtUtil;

	//to register a user
	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody User user) {
		System.out.println("Received user: " + user);
		Optional<User> existingUser = userService.findByEmail(user.getEmail());
		
		if(existingUser.isPresent()) {
			return ResponseEntity.badRequest().body("Email already registered");
		}
		user.setRole(Role.USER);
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		userService.saveUser(user);
		return ResponseEntity.ok("User Registered Successfully");
	}
	
	//login a user
	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
		 String email = loginRequest.get("email");
		    String password = loginRequest.get("password");
		    System.out.println("Login attempt for email: " + email);

		    Optional<User> userOpt = userService.findByEmail(email);
		    System.out.println("Result of findByEmail: " + (userOpt.isPresent() ? "User FOUND" : "User NOT FOUND"));

		    if (userOpt.isPresent()) {
		        User user = userOpt.get();
		        System.out.println("Stored encoded password: " + user.getPassword());
		        System.out.println("Raw password from request: " + password);

		        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
		        System.out.println("Password matches result: " + passwordMatches);

		        if (passwordMatches) {
		        	Map<String, Object> response = new HashMap<>();
		            response.put("token", "dummy-jwt-token");
		            response.put("userId", user.getId());
		            response.put("role",user.getRole());
		            return ResponseEntity.ok(response);
		        } else {
		            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
		        }
		    } else {
		        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
		    }
	}
	
	@GetMapping("/{email}")
	public ResponseEntity<User> getUser(@PathVariable String email){
		Optional<User> user =userService.findByEmail(email);
		return user.map(ResponseEntity::ok)
	               .orElseGet(() -> ResponseEntity.notFound().build());
	}
	
	@PutMapping("/update/{email}")
	public ResponseEntity<User> updateUser(@PathVariable String email,@RequestBody User updatedUser){
		User user = userService.updateUserProfile(email, updatedUser);
		return user!=null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
	}
	
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

}
