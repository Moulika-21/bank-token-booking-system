package com.banktoken.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banktoken.model.Bank;
import com.banktoken.service.*;

@RestController
@RequestMapping("/api/banks")
@CrossOrigin(origins = "http://localhost:3000")
public class BankController {
	 @Autowired
	 private BankService bankService;
	 
	 @Autowired
	 private AccountService accountService;

	    @GetMapping
	    public ResponseEntity<List<Bank>> getAllBanks() {
	        List<Bank> banks = bankService.getAllBanks();
	        return ResponseEntity.ok(banks);
	    }
	    
	    @GetMapping("/user/{userId}")
	    public ResponseEntity<List<Bank>> getBanksByUser(@PathVariable Long userId){
	    	List<Bank> userBanks = accountService.getBanksByUserId(userId);
	    	return ResponseEntity.ok(userBanks);
	    }
}
