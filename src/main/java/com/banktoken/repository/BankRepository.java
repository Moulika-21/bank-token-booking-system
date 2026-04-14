package com.banktoken.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.banktoken.model.*;
import java.util.*;

public interface BankRepository extends JpaRepository<Bank,Long>{
	Optional<Bank> findByName(String name);
	List<Bank> findAll();
}
