package com.banktoken.service;

import java.util.*;

import org.springframework.stereotype.Service;

import com.banktoken.model.*;


public interface BankService {
	Optional<Bank> findByName(String name);
    List<Branch> getBranchesForBank(Long bankId);
    List<Bank> getAllBanks();
    Optional<Bank> findById(Long id);
}
