package com.banktoken.security;

import java.util.Collections;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.banktoken.model.User;
import com.banktoken.service.UserService;

@Service
public class CustomUserDetailsService implements UserDetailsService{
	private final UserService userService;

    public CustomUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userService.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.emptyList()
        );
    }
}
