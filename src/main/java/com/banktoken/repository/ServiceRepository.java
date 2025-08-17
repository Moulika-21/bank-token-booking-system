package com.banktoken.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.banktoken.model.BranchService;

public interface ServiceRepository extends JpaRepository<BranchService, Long>{
	List<BranchService> findByBranchId(Long branchId);
}
