package com.banktoken.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.banktoken.dto.BranchServiceCountDTO;
import com.banktoken.dto.SlotDTO;
import com.banktoken.dto.TokenRequest;
import com.banktoken.dto.TokenSummaryDTO;
import com.banktoken.model.Token;

public interface TokenService {
	
	Token bookToken(TokenRequest request);
	Token save(Token token);
	
	List<Token> getTokensByUser(Long userId);
	List<Token> getTokensByUserAndDate(Long userId, String date);
	Optional<Token> findById(Long id);
	
	List<Token> filterTokens(Long branchId, Long serviceId, LocalDateTime startTime, LocalDateTime endTime);
	List<BranchServiceCountDTO> getTokenCountByBranch();
    List<BranchServiceCountDTO> getTokenCountByService();
    
    List<BranchServiceCountDTO> getTokenCountByBranchForMonth(String month);
    List<BranchServiceCountDTO> getTokenCountByServiceForMonth(String month);
	
	List<Token> getTodayTokens();
	TokenSummaryDTO getTodayTokenSummary();
	
	void clearUserHistory(Long userId);
	List<SlotDTO> getSlotsForDate(LocalDate date);
	
	void checkAndExpireTokens();
}
