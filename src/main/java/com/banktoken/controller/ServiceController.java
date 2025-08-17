package com.banktoken.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banktoken.model.Branch;
import com.banktoken.model.BranchService;
import com.banktoken.service.ServiceService;

@RestController
@RequestMapping("/api/services")
public class ServiceController {
	
	@Autowired
    private ServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<BranchService>> getAllServices() {
//        return ResponseEntity.ok(serviceService.getAllServices());
        List<BranchService> services = serviceService.getAllServices();
        services.forEach(b -> System.out.println("Branch: id=" + b.getId() + ", name=" + b.getName()));
        return ResponseEntity.ok(services);
    }
}
