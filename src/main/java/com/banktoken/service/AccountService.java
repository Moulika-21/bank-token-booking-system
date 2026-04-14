package com.banktoken.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import com.banktoken.model.Account;
import com.banktoken.model.Bank;
import com.banktoken.repository.AccountRepository;

@Service
public class AccountService {
	
	@Autowired
	private AccountRepository accountRepository;
	
	public Account saveAccount(Account account) {
		return accountRepository.save(account);
	}
	
	public List<Account> getAccountsByUser(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    public Optional<Account> getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }
    
    public List<Bank> getBanksByUserId(Long userId) {
        List<Account> accounts = accountRepository.findByUserId(userId);
        return accounts.stream()
                       .map(Account::getBank)
                       .distinct()
                       .collect(Collectors.toList());
    }

}
