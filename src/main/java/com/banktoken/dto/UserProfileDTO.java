package com.banktoken.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
		private String name;
		private String accountNumber;
		private String bankName;
		public String getName() {
			return name;
		}
		public UserProfileDTO(String name, String accountNumber, String bankName, String branchName, String email,
				String phoneNumber) {
			super();
			this.name = name;
			this.accountNumber = accountNumber;
			this.bankName = bankName;
			this.branchName = branchName;
			this.email = email;
			this.phoneNumber = phoneNumber;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getAccountNumber() {
			return accountNumber;
		}
		public void setAccountNumber(String accountNumber) {
			this.accountNumber = accountNumber;
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
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public String getPhoneNumber() {
			return phoneNumber;
		}
		public void setPhoneNumber(String phoneNumber) {
			this.phoneNumber = phoneNumber;
		}
		private String branchName;
		private String email;
		private String phoneNumber;
}
