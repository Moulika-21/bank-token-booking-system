package com.banktoken.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banktoken.model.Branch;
import com.banktoken.service.BranchService;

@RestController
@RequestMapping("/api/branches")
public class BranchController {
	
	@Autowired
    private BranchService branchService;

    @GetMapping
    public List<Branch> getAllBranches() {
//        return branchService.getAllBranches();
    	List<Branch> branches = branchService.getAllBranches();
        branches.forEach(b -> System.out.println("Branch: id=" + b.getId() + ", name=" + b.getName()));
        return branches;
    }
}
