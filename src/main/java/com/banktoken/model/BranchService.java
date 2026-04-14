package com.banktoken.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name= "services")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BranchService {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	private int durationMinutes;
	
	@ManyToOne
	@JoinColumn(name = "branch_id")
	private Branch branch;
	
	public int getDurationMinutes() {
		return durationMinutes;
	}

	public void setDurationMinutes(int durationMinutes) {
		this.durationMinutes = durationMinutes;
	}

	public Boolean getRequiresTransaction() {
		return requiresTransaction;
	}

	public void setRequiresTransaction(Boolean requiresTransaction) {
		this.requiresTransaction = requiresTransaction;
	}

	public String getPredefinedTransaction() {
		return predefinedTransaction;
	}

	public void setPredefinedTransaction(String predefinedTransaction) {
		this.predefinedTransaction = predefinedTransaction;
	}

	private Boolean requiresTransaction;
	private String predefinedTransaction;


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Branch getBranch() {
		return branch;
	}

	public void setBranch(Branch branch) {
		this.branch = branch;
	}
}
