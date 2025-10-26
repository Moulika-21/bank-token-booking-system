package com.banktoken;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan("com.banktoken") 
@EnableScheduling
public class BankTokenManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(BankTokenManagementApplication.class, args);
	}
	 
}
