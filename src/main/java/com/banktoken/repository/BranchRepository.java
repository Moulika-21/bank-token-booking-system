package com.banktoken.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.banktoken.model.*;
import java.util.*;

public interface BranchRepository extends JpaRepository<Branch, Long>{
	Optional<Branch> findById(Long bankId);
	List<Branch> findByBank_Id(Long bankId); // find branches for a bank
	
    Optional<Branch> findByNameAndBank_Id(String branchName, Long bankId);
}
