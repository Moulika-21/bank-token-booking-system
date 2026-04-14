package com.banktoken.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banktoken.model.Account;
import com.banktoken.service.AccountService;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
	
	@Autowired
    private AccountService accountService;
	
	@PostMapping
    public ResponseEntity<?> createAccount(@RequestBody Account account) {
        if (!account.getAccountNumber().matches("\\d{9,18}")) {  // allow 9-18 digits
            return ResponseEntity.badRequest().body("Invalid account number format");
        }

    
        if (accountService.getAccountByNumber(account.getAccountNumber()).isPresent()) {
            return ResponseEntity.badRequest().body("Account number already exists");
        }

        Account saved = accountService.saveAccount(account);
        return ResponseEntity.ok(saved);
    }
	
	@GetMapping("/user/{userId}")
    public ResponseEntity<List<Account>> getAccountsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(accountService.getAccountsByUser(userId));
    }
	
}
