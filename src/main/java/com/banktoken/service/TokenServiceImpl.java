package com.banktoken.service;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.banktoken.dto.BranchServiceCountDTO;
import com.banktoken.dto.SlotDTO;
import com.banktoken.dto.TokenRequest;
import com.banktoken.dto.TokenSummaryDTO;
import com.banktoken.model.*;
import com.banktoken.repository.BranchRepository;
import com.banktoken.repository.ServiceRepository;
import com.banktoken.repository.TokenRepository;
import com.banktoken.repository.UserRepository;

import com.banktoken.exception.*;

@Service
public class TokenServiceImpl implements TokenService{
	
	@Autowired 
	private TokenRepository tokenRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private BranchRepository branchRepository;
	
	@Autowired
	private ServiceRepository serviceRepository;
	
	@Autowired
	private EmailService emailService;
	
	public Token bookToken(TokenRequest request) {
		LocalDate bookingDate = LocalDate.parse(request.getBookingDate());
		 boolean exists = tokenRepository.existsByUserIdAndBookingDate(request.getUserId(),bookingDate);

	     if (exists) {
	    	 throw new TokenLimitExceededException("You can book only one token per day.");
	     }
		Token token =new Token();
		
		int nextTokenNumber = tokenRepository.getNextTokenNumberForDate(bookingDate);
		token.setTokenNumber(nextTokenNumber);
		token.setStatus(TokenStatus.BOOKED);
		token.setBookingTime(LocalDateTime.now());
		
		if (request.getBookingDate() != null) {
	        token.setBookingDate(LocalDate.parse(request.getBookingDate()));
	    } else {
	        throw new RuntimeException("Booking date is required");
	    }
		
		if (request.getSlotTime() != null) {
//			String raw = request.getSlotTime(); 
//			String timePart = raw.substring(raw.indexOf("(") + 1, raw.lastIndexOf(")"));
	        token.setSlotTime(request.getSlotTime());
	    } else {
	        throw new RuntimeException("Slot time is required");
	    }
		token.setTransactionType(request.getTransactionType());
		
		System.out.println("Booking token for userId: " + request.getUserId());
		token.setUser(userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found with id " + request.getUserId())));
		
		token.setBranch(branchRepository.findById(request.getBranchId()).orElseThrow());
		token.setService(serviceRepository.findById(request.getServiceId()).orElseThrow());
		
//		emailService.sendTokenConfirmation(request.getUserEmail(), String.valueOf(token.getId()));
		
		return tokenRepository.save(token);
	}
	
	private int generateTokenNumber() {
		long count =tokenRepository.count();
		return (int) count+1;
	}
	
	@Override 
	public List<Token> getTokensByUser(Long userId){
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		return tokenRepository.findByUserAndHiddenFalse(user);
	}
	
	@Override
	public List<Token> getTokensByUserAndDate(Long userId, String date) {
	    LocalDate localDate = LocalDate.parse(date);
	    LocalDateTime startOfDay = localDate.atStartOfDay();
	    LocalDateTime endOfDay = localDate.atTime(LocalTime.MAX);
	    return tokenRepository.findByUserIdAndBookingTimeBetweenAndHiddenFalse(userId, startOfDay, endOfDay);
	}

	
	@Override 
	public List<Token> filterTokens(Long branchId,Long serviceId,LocalDateTime startTime, LocalDateTime endTime){
		return tokenRepository.findByBranchIdAndServiceIdAndBookingTimeBetweenOrderByBookingTimeAsc(branchId, serviceId, startTime, endTime);
	}
	
	public Optional<Token> findById(Long id){
		return tokenRepository.findById(id);
	}
	
	public Token save(Token token) {
		return tokenRepository.save(token);
	}
	
	public List<Token> getTodayTokens() {
	    LocalDate today = LocalDate.now();
	    return tokenRepository.findByBookingDate(today);
	}

	
	public TokenSummaryDTO getTodayTokenSummary() {
		TokenSummaryDTO dto =new TokenSummaryDTO();
		dto.setTotalTokensToday(tokenRepository.countTokensToday());
		
		Map<String, Long> branchMap =new HashMap<>();
		for(Object[] row : tokenRepository.countTokensByBranchToday()) {
			branchMap.put((String) row[0], (Long) row[1]);
		}
		dto.setTokensByBranch(branchMap);
		
		Map<String, Long> serviceMap =new HashMap<>();
		for(Object[] row : tokenRepository.countTokensByServiceToday()) {
			serviceMap.put((String) row[0], (Long) row[1]);
		}
		dto.setTokensByService(branchMap);
		
		return dto;
	}
	
	@Override
	public List<BranchServiceCountDTO> getTokenCountByBranch() {
	    return tokenRepository.countTokensByBranch();
	}

	@Override
	public List<BranchServiceCountDTO> getTokenCountByService() {
	    return tokenRepository.countTokensByService();
	}
	
	@Override
	public List<BranchServiceCountDTO> getTokenCountByBranchForMonth(String month) {
        YearMonth ym = YearMonth.parse(month); // e.g. "2025-09"
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        return tokenRepository.countTokensByBranchInRange(start, end);
    }
	
	@Override
    public List<BranchServiceCountDTO> getTokenCountByServiceForMonth(String month) {
        YearMonth ym = YearMonth.parse(month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        return tokenRepository.countTokensByServiceInRange(start, end);
    }
	
	@Override
	public List<SlotDTO> getSlotsForDate(LocalDate date) {
        // All possible slots (you can customize this list)
        List<String> allSlots = List.of(
            "09:00 - 09:15","09:15 - 09:30",
            "09:30 - 09:45","09:45 - 10:00",
            "10:00 - 10:15","10:15 - 10:30",
            "10:30 - 10:45","10:45 - 11:00",
            "11:00 - 11:15","11:15 - 11:30",
            "11:30 - 11:45","11:45 - 12:00",
            "12:00 - 12:15","12:15 - 12:30",
            "01:30 - 01:45","01:45 - 02:00",
            "02:00 - 02:15","02:15 - 02:30",
            "02:30 - 02:45","02:45 - 03:00",
            "03:00 - 03:15","03:15 - 03:30",
            "03:30 - 03:45","03:45 - 04:00"
        );

        // Fetch booked tokens for the date
        List<Token> bookedTokens = tokenRepository.findByBookingDateAndStatus(date,TokenStatus.BOOKED);
        
        // Map booked slots to slot list with status
        List<SlotDTO> slots = new ArrayList<>();
        for (String slot : allSlots) {
            boolean isBooked = bookedTokens.stream()
                    .anyMatch(t ->{
                        String dbSlot = t.getSlotTime(); // normalize DB value
                        String uiSlot = slot;           // normalize UI value
                        boolean match = dbSlot.equals(uiSlot);
                        return match;
                    });
           
            slots.add(new SlotDTO(slot, isBooked));
            
        }
        
        return slots;
    }
	
	@Override
	public void clearUserHistory(Long userId) {
		List<Token> tokens = tokenRepository.findByUserId(userId);
	    for (Token token : tokens) {
	        token.setHidden(true);   // 👈 mark as cleared
	    }
	    tokenRepository.saveAll(tokens);
//        tokenRepository.clearHistoryByUserId(userId);
    }
	
	@Override
	public void checkAndExpireTokens() {
		List<Token> tokens= tokenRepository.findByStatus(TokenStatus.BOOKED);
		LocalDateTime now = LocalDateTime.now();
		
		for(Token token: tokens) {
			if(token.getBookingTime().plusMinutes(30).isBefore(now)) {
				token.setStatus(TokenStatus.EXPIRED);
				tokenRepository.save(token);
			}
		}
	}
	
	@Scheduled(fixedRate=3000000)
	public void runExpiryTaks() {
		checkAndExpireTokens();
	}
}

