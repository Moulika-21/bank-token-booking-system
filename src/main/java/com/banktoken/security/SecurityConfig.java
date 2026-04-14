package com.banktoken.security;

import java.util.List;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.banktoken.model.User;
import com.banktoken.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.banktoken.util.JwtUtil;

@Configuration
public class SecurityConfig {
	
	
	
	private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder; 

    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }
	
	@Bean 
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http 
		.cors().and()
		.csrf().disable()
		.sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
		.authorizeHttpRequests()
		.requestMatchers("/api/auth/**","/api/users/**","/api/branches/**","/api/services/**","/api/tokens/book","/api/tokens/user/**","/api/tokens/summary/**","/api/tokens/today",
			    "/api/tokens/*/status","/api/tokens/**","/api/banks/**").permitAll()
		.requestMatchers("/api/banks/**").authenticated()
		.anyRequest().authenticated().and()
        .addFilterBefore(
                new JwtAuthenticationFilter(jwtUtil, userDetailsService),
                UsernamePasswordAuthenticationFilter.class
            );
		return http.build();
	}
	
	 	@Bean
	    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
	        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
	        authBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
	        return authBuilder.build();
	    }

	   
	@Bean 
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of("http://localhost:3000"));
		configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setAllowCredentials(true);
		
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
	

}
