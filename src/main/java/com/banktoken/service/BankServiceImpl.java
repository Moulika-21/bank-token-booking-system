package com.banktoken.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import com.banktoken.model.*;
import com.banktoken.repository.BankRepository;
import com.banktoken.repository.BranchRepository;

@Service
public class BankServiceImpl implements BankService{
	
	@Autowired
    private BankRepository bankRepository;
	
    @Autowired
    private BranchRepository branchRepository;
    
    @Override
    public List<Bank> getAllBanks() {
        return bankRepository.findAll();
    }
    
    @Override
    public Optional<Bank> findById(Long id) {
        return bankRepository.findById(id);
    }
    public Optional<Bank> findByName(String name) {
        return bankRepository.findByName(name);
    }

    public List<Branch> getBranchesForBank(Long bankId) {
        return branchRepository.findByBank_Id(bankId);
    }
}
