package com.banktoken.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.banktoken.model.Branch;
import com.banktoken.repository.BranchRepository;

@Service
public class BranchService {
	
	@Autowired
    private BranchRepository branchRepository;

    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }
    
    public Optional<Branch> findById(Long id) {
        return branchRepository.findById(id);
    }
    
    public List<Branch> findByBankId(Long id) {
//        return branchRepository.findByBank_Id(id);
    	List<Branch> branches = branchRepository.findByBank_Id(id);
        System.out.println("Found branches for bank " + id + ": " + branches.size());
        return branches;
    }
    
    public Optional<Branch> findByNameAndBankId(String name,Long id){
    	return branchRepository.findByNameAndBank_Id(name, id);
    }
}
