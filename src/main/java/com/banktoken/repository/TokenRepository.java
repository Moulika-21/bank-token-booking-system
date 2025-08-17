package com.banktoken.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.banktoken.dto.BranchServiceCountDTO;
import com.banktoken.model.*;

import jakarta.transaction.Transactional;

public interface TokenRepository extends JpaRepository<Token, Long>{
	List<Token> findByUserAndHiddenFalse(User user);
	List<Token> findByUserId(Long userId);
	
	List<Token> findByBranchIdAndServiceIdAndBookingTimeBetweenOrderByBookingTimeAsc(
			Long branchId, Long serviceId,
			LocalDateTime startTime, LocalDateTime endTime
	);
	
	List<Token> findByBookingTimeBetween(LocalDateTime start, LocalDateTime end);
	
	List<Token> findByStatus(TokenStatus status);
	List<Token> findByTransactionType(TransactionType type);
	
	List<Token> findByBookingDateAndStatus(LocalDate bookingDate,TokenStatus status);
	List<Token> findByBookingDate(LocalDate bookingDate);
	
	@Query("select count(t) from Token t where t.bookingDate = current_date")
	Long countTokensToday();
	
	@Query("select t.branch.name, count(t) from Token t where t.bookingDate = current_date group by t.branch.name")
	List<Object[]> countTokensByBranchToday();
	
	@Query("select t.service.name, count(t) from Token t where t.bookingDate = current_date group by t.service.name")
	List<Object[]> countTokensByServiceToday();
	
	@Query("SELECT new com.banktoken.dto.BranchServiceCountDTO(t.branch.name, COUNT(t)) FROM Token t where t.bookingDate = current_date GROUP BY t.branch.name")
    List<BranchServiceCountDTO> countTokensByBranch();

    @Query("SELECT new com.banktoken.dto.BranchServiceCountDTO(t.service.name, COUNT(t)) FROM Token t where t.bookingDate = current_date GROUP BY t.service.name")
    List<BranchServiceCountDTO> countTokensByService();
	
    List<Token> findByUserIdAndBookingTimeBetweenAndHiddenFalse(Long userId, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT COUNT(t) FROM Token t where t.bookingDate = current_date")
    Long getTotalTokens();

    @Query("SELECT COUNT(t) FROM Token t WHERE t.status = 'BOOKED' and t.bookingDate = current_date")
    Long getBookedTokens();

    @Query("SELECT COUNT(t) FROM Token t WHERE t.status = 'SERVED' and t.bookingDate = current_date")
    Long getCompletedTokens();
    
    @Query("SELECT COUNT(t) FROM Token t WHERE t.status = 'IN_PROCESS' and t.bookingDate = current_date")
    Long getProcessingTokens();
    
    @Query("SELECT COUNT(t) FROM Token t WHERE t.status = 'CANCELLED' and t.bookingDate = current_date")
    Long getCancelledTokens();
    
    @Query("SELECT t.slotTime FROM Token t WHERE DATE(t.bookingTime) = :date AND t.status = com.banktoken.model.TokenStatus.BOOKED")
    List<String> findBookedSlotsByDate(@Param("date") LocalDate date);
    
    @Query("SELECT COALESCE(MAX(t.tokenNumber), 0) + 1 FROM Token t WHERE t.bookingDate = :date")
    int getNextTokenNumberForDate(@Param("date") LocalDate date);


    @Modifying
    @Transactional
    @Query("UPDATE Token t SET t.hidden = true WHERE t.user.id = :userId")
    void clearHistoryByUserId(@Param("userId") Long userId);

    // Fetch only non-cleared tokens for MyTokens
    List<Token> findByUserIdAndHiddenFalse(Long userId);
}
