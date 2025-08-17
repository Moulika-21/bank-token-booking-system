package com.banktoken.dto;

import java.util.Map;

import lombok.Data;

@Data
public class TokenSummaryDTO {
	private Long totalTokensToday;
	private Map<String, Long> tokensByBranch;
	private Map<String, Long> tokensByService;
	public Long getTotalTokensToday() {
		return totalTokensToday;
	}
	public void setTotalTokensToday(Long totalTokensToday) {
		this.totalTokensToday = totalTokensToday;
	}
	public Map<String, Long> getTokensByBranch() {
		return tokensByBranch;
	}
	public void setTokensByBranch(Map<String, Long> tokensByBranch) {
		this.tokensByBranch = tokensByBranch;
	}
	public Map<String, Long> getTokensByService() {
		return tokensByService;
	}
	public void setTokensByService(Map<String, Long> tokensByService) {
		this.tokensByService = tokensByService;
	}
	
}
