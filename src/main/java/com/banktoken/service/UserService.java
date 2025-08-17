package com.banktoken.service;

import java.util.Optional;


import com.banktoken.model.User;


public interface UserService {
	User saveUser(User user);
	Optional<User> findByEmail(String email);
	Optional<User> findById(Long id);
	
	User updateUserProfile(String email, User updatedUser);
	
	
}
