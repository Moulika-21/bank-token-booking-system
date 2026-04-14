package com.banktoken.dto;

public class BranchServiceCountDTO {
	 private String bankName;
	 private String branchName;
	private String name;
	private long count;
	
	public BranchServiceCountDTO(String bankName,String branchName,String name, long count) {
		this.name=name;
		this.bankName=bankName;
		this.branchName=branchName;
		this.count=count;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getCount() {
		return count;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getBranchName() {
		return branchName;
	}

	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}

	public BranchServiceCountDTO() {
		// TODO Auto-generated constructor stub
	}

	public void setCount(long count) {
		this.count = count;
	}
	
}
