package com.banktoken.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.banktoken.model.Account;
import java.util.*;

public interface AccountRepository extends JpaRepository<Account, Long>{
	Optional<Account> findByAccountNumber(String accountNumber);
	List<Account> findByUserId(Long userId);
}
