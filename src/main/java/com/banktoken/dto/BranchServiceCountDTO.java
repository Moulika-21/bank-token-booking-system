package com.banktoken.dto;

public class BranchServiceCountDTO {
	private String name;
	private long count;
	
	public BranchServiceCountDTO(String name, long count) {
		this.name=name;
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

	public BranchServiceCountDTO() {
		// TODO Auto-generated constructor stub
	}

	public void setCount(long count) {
		this.count = count;
	}
	
}
