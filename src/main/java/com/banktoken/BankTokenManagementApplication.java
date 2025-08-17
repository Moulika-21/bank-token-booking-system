package com.banktoken;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.banktoken") 
public class BankTokenManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(BankTokenManagementApplication.class, args);
	}

}
