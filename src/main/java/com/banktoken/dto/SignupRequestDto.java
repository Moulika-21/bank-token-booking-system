package com.banktoken.dto;

public class SignupRequestDto {
	private String name;
    private String email;
    private String password;
    private String confirmPassword;
    private String phoneNumber;
    private String accountNumber;
    private Long bankId;
	private Long branchId;
	public String getRecaptchaToken() {
		return recaptchaToken;
	}
	public void setRecaptchaToken(String recaptchaToken) {
		this.recaptchaToken = recaptchaToken;
	}
	private String recaptchaToken;


   
	public Long getBankId() {
		return bankId;
	}
	public void setBankId(Long bankId) {
		this.bankId = bankId;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String Name) {
		this.name = Name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getConfirmPassword() {
		return confirmPassword;
	}
	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public String getAccountNumber() {
		return accountNumber;
	}
	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}
	public Long getBranchId() {
		return branchId;
	}
	public void setBranchId(Long branchId) {
		this.branchId = branchId;
	}
}
