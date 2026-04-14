package com.banktoken.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name= "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Bank getBank() {
		return bank;
	}

	public void setBank(Bank bank) {
		this.bank = bank;
	}

	public Branch getBranch() {
		return branch;
	}

	public void setBranch(Branch branch) {
		this.branch = branch;
	}

	@Column(name= "account_number")
	private String accountNumber;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	@ManyToOne
	@JoinColumn(name = "bank_id")
	private Bank bank;
	
	@ManyToOne
	@JoinColumn(name = "branch_id")
	private Branch branch;
}
