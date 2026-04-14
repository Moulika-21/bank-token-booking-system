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
	List<BranchServiceCountDTO> getTokenCountByBranch(Long bankId);
    List<BranchServiceCountDTO> getTokenCountByService(Long bankId);
    
    List<BranchServiceCountDTO> getTokenCountByBranchForMonth(String month,Long bankId);
    List<BranchServiceCountDTO> getTokenCountByServiceForMonth(String month,Long bankId);
	
	List<Token> getTodayTokens(Long bankId);
	TokenSummaryDTO getTodayTokenSummary(Long bankId);
	
	void clearUserHistory(Long userId);
	List<SlotDTO> getSlotsForDate(LocalDate date);
	
	List<SlotDTO> getSlotsForDateAndService(LocalDate localDate,Long serviceId);
	
	void checkAndExpireTokens();
}
