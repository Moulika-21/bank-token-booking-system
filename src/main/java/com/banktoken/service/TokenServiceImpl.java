package com.banktoken.service;

import java.sql.Time;
import java.time.DayOfWeek;
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
import com.banktoken.model.BranchService;
import com.banktoken.model.*;
import com.banktoken.repository.BankRepository;
import com.banktoken.repository.BranchRepository;
import com.banktoken.repository.ServiceRepository;
import com.banktoken.repository.TokenRepository;
import com.banktoken.repository.UserRepository;

import jakarta.transaction.Transactional;

import com.banktoken.exception.*;

@Service
public class TokenServiceImpl implements TokenService{
	
	@Autowired 
	private TokenRepository tokenRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private BankRepository bankRepository;
	
	@Autowired
	private BranchRepository branchRepository;
	
	@Autowired
	private ServiceRepository serviceRepository;
	
	@Autowired
	private EmailService emailService;
	
	@Transactional
	public Token bookToken(TokenRequest request) {
		LocalDate bookingDate = LocalDate.parse(request.getBookingDate());
		 boolean exists = tokenRepository.existsByUserIdAndBookingDate(request.getUserId(),bookingDate);

	     if (exists) {
	    	 throw new TokenLimitExceededException("You can book only one token per day.");
	     }
	     
	     BranchService service = serviceRepository.findById(request.getServiceId())
	             .orElseThrow(() -> new RuntimeException("Service not found"));
	     
	    int lastTokenNumber = tokenRepository.getNextTokenNumberForDateAndBranch(bookingDate, request.getBankId(), request.getBranchId(),request.getServiceId());
	    
		Token token =new Token();
		
		int nextTokenNumber = lastTokenNumber + 1;
		token.setTokenNumber(nextTokenNumber);
		token.setStatus(TokenStatus.BOOKED);
		token.setBookingTime(LocalDateTime.now());
		
		if (request.getBookingDate() != null) {
	        token.setBookingDate(LocalDate.parse(request.getBookingDate()));
	    } else {
	        throw new RuntimeException("Booking date is required");
	    }
		
		if (request.getSlotTime() != null) {
	        token.setSlotTime(request.getSlotTime());
	    } else {
	        throw new RuntimeException("Slot time is required");
	    }
		
//		 BranchService service = serviceRepository.findById(request.getServiceId())
//			        .orElseThrow(() -> new RuntimeException("Service not found with id " + request.getServiceId()));

			    if (Boolean.TRUE.equals(service.getRequiresTransaction())) {
			        // Case 1: Service requires transaction selection (Deposit / Withdraw)
			        if (request.getTransactionType() == null) {
			            throw new RuntimeException("Transaction type is required for this service");
			        }
			        token.setTransactionType(request.getTransactionType());
			    } 
			    else if (service.getPredefinedTransaction() != null) {
			        // Case 2: Service has a predefined transaction type (like REQUEST / SERVICE)
			        try {
			            token.setTransactionType(TransactionType.valueOf(service.getPredefinedTransaction().toUpperCase()));
			        } catch (IllegalArgumentException e) {
			            // Fallback if predefined type doesn't match enum
			            token.setTransactionType(TransactionType.SERVICE);
			        }
			    } 
			    else {
			        // Case 3: Default fallback
			        token.setTransactionType(TransactionType.SERVICE);
			    }
		

		
		System.out.println("Booking token for userId: " + request.getUserId());
		
		token.setUser(userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found with id " + request.getUserId())));
		token.setBank(bankRepository.findById(request.getBankId()).orElseThrow(() -> new RuntimeException("Bank not found with id " + request.getBankId())));
		token.setBranch(branchRepository.findById(request.getBranchId()).orElseThrow());
		token.setService(serviceRepository.findById(request.getServiceId()).orElseThrow());
		
		
		return tokenRepository.save(token);
	}
	
	@Override
	public List<SlotDTO> getSlotsForDateAndService(LocalDate date, Long serviceId) {
		
		 if (date.getDayOfWeek() == DayOfWeek.SATURDAY ||
			        date.getDayOfWeek() == DayOfWeek.SUNDAY) {
			        return new ArrayList<>();
		}

	    BranchService service = serviceRepository.findById(serviceId)
	            .orElseThrow(() -> new RuntimeException("Service not found"));

	    int duration = service.getDurationMinutes();

	    LocalTime start = LocalTime.of(9, 0);
	    LocalTime end = LocalTime.of(17, 0);
	    
	    LocalTime lunchStart = LocalTime.of(13, 0);
	    LocalTime lunchEnd = LocalTime.of(14,0 );

	    // Short breaks
	    LocalTime teaBreak1Start = LocalTime.of(11, 30);
	    LocalTime teaBreak1End = LocalTime.of(11, 40);

	    LocalTime teaBreak2Start = LocalTime.of(15, 30);
	    LocalTime teaBreak2End = LocalTime.of(15, 40);
	    LocalTime now = LocalTime.now();
	    List<Token> bookedTokens =
	            tokenRepository.findByBookingDateAndStatus(date, TokenStatus.BOOKED);

	    List<SlotDTO> slots = new ArrayList<>();

	    while (!start.plusMinutes(duration).isAfter(end)) {

	        LocalTime slotEnd = start.plusMinutes(duration);

	        // ❌ 2. Skip past time (only for today)
	        if (date.equals(LocalDate.now()) && slotEnd.isBefore(now)) {
	            start = slotEnd;
	            continue;
	        }

	        // ❌ 3. Skip lunch overlap
	        if (start.isBefore(lunchEnd) && slotEnd.isAfter(lunchStart)) {
	            start = lunchEnd;
	            continue;
	        }

	        // ❌ Skip tea break 1
	        if (start.isBefore(teaBreak1End) && slotEnd.isAfter(teaBreak1Start)) {
	            start = teaBreak1End;
	            continue;
	        }

	        // ❌ Skip tea break 2
	        if (start.isBefore(teaBreak2End) && slotEnd.isAfter(teaBreak2Start)) {
	            start = teaBreak2End;
	            continue;
	        }

	        String slot = start + " - " + slotEnd;

	        boolean booked = bookedTokens.stream()
	                .anyMatch(t ->
	                        t.getService().getId().equals(serviceId) &&
	                        t.getSlotTime().equals(slot)
	                );

	        slots.add(new SlotDTO(slot, booked));

	        start = slotEnd;
	    }

	    return slots;
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
	
	public List<Token> getTodayTokens(Long bankId) {
	    LocalDate today = LocalDate.now();
	    return tokenRepository.findByBookingDateAndBankId(today, bankId);
//	    return tokenRepository.findByBookingDate(today);
	}

	
	public TokenSummaryDTO getTodayTokenSummary(Long bankId) {
		TokenSummaryDTO dto =new TokenSummaryDTO();
		dto.setTotalTokensToday(tokenRepository.countTokensToday(bankId));
		
		Map<String, Long> branchMap =new HashMap<>();
		for(Object[] row : tokenRepository.countTokensByBranchToday(bankId)) {
			branchMap.put((String) row[0], (Long) row[1]);
		}
		dto.setTokensByBranch(branchMap);
		
		Map<String, Long> serviceMap =new HashMap<>();
		for(Object[] row : tokenRepository.countTokensByServiceToday(bankId)) {
			serviceMap.put((String) row[0], (Long) row[1]);
		}
		dto.setTokensByService(serviceMap);
		
		return dto;
	}
	
	@Override
	public List<BranchServiceCountDTO> getTokenCountByBranch(Long bankId) {
	    return tokenRepository.countTokensByBranch(bankId);
	}

	@Override
	public List<BranchServiceCountDTO> getTokenCountByService(Long bankId) {
	    return tokenRepository.countTokensByService(bankId);
	}
	
	@Override
	public List<BranchServiceCountDTO> getTokenCountByBranchForMonth(String month,Long bankId) {
        YearMonth ym = YearMonth.parse(month); // e.g. "2025-09"
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        return tokenRepository.countTokensByBranchInRange(start, end,bankId);
    }
	
	@Override
    public List<BranchServiceCountDTO> getTokenCountByServiceForMonth(String month,Long bankId) {
        YearMonth ym = YearMonth.parse(month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        return tokenRepository.countTokensByServiceInRange(start, end,bankId);
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

