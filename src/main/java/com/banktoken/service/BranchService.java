package com.banktoken.service;

import java.util.List;

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
}
