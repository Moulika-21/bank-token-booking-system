package com.banktoken.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.banktoken.model.User;
import com.banktoken.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService{
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Override
	public User saveUser(User user) {
		return userRepository.save(user);
	}
	
	@Override
	public Optional<User> findByEmail(String email){
		System.out.println("Looking for user by email: [" + email + "]");
		return userRepository.findByEmail(email);
	}
	
	@Override
	public Optional<User> findById(Long id){
		return userRepository.findById(id);
	}
	
	@Override
	public User updateUserProfile(String email, User updatedUser) {
		Optional<User> existingUserOpt = userRepository.findByEmail(email);
		if(existingUserOpt.isPresent()) {
			User existingUser = existingUserOpt.get();
			existingUser.setName(updatedUser.getName());
			existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
			existingUser.setBranch(updatedUser.getBranch());
			existingUser.setEmail(updatedUser.getEmail());
			
			return userRepository.save(existingUser);
			
		}
		return null;
	}
	
	
}
