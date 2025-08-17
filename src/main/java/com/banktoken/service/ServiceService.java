package com.banktoken.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.banktoken.model.BranchService;
import com.banktoken.repository.ServiceRepository;

@Service
public class ServiceService {
	
	 @Autowired
	    private ServiceRepository serviceRepository;

	    public List<BranchService> getAllServices() {
	        return serviceRepository.findAll();
	    }
}
