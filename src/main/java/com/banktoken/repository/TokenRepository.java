package com.banktoken.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.banktoken.dto.BranchServiceCountDTO;
import com.banktoken.model.*;

import jakarta.persistence.LockModeType;
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
	
	boolean existsByUserIdAndBookingDate(Long userId, LocalDate bookingDate);
	
	@Query("select count(t) from Token t where  t.bank.id = :bankId and t.bookingDate = current_date")
	Long countTokensToday(@Param("bankId") Long bankId);
	
	@Query("select t.branch.name, count(t) from Token t where  t.bank.id = :bankId and t.bookingDate = current_date group by t.branch.name")
	List<Object[]> countTokensByBranchToday(@Param("bankId") Long bankId);
	
	@Query("select t.service.name, count(t) from Token t where  t.bank.id = :bankId and t.bookingDate = current_date group by t.service.name")
	List<Object[]> countTokensByServiceToday(@Param("bankId") Long bankId);
	
	@Query("SELECT new com.banktoken.dto.BranchServiceCountDTO(t.bank.name,t.branch.name,null, COUNT(t)) FROM Token t WHERE t.bank.id = :bankId and t.bookingDate = current_date GROUP BY t.bank.name,t.branch.name")
    List<BranchServiceCountDTO> countTokensByBranch(@Param("bankId") Long bankId);

    @Query("SELECT new com.banktoken.dto.BranchServiceCountDTO(t.bank.name,t.branch.name,t.service.name, COUNT(t)) FROM Token t where t.bank.id = :bankId and t.bookingDate = current_date GROUP BY t.bank.name, t.branch.name,t.service.name")
    List<BranchServiceCountDTO> countTokensByService(@Param("bankId") Long bankId);
	
     @Query("SELECT new com.banktoken.dto.BranchServiceCountDTO(t.bank.name,t.branch.name,null, COUNT(t)) " +
            "FROM Token t WHERE t.bank.id = :bankId and t.bookingDate BETWEEN :startDate AND :endDate GROUP BY t.bank.name,t.branch.name")
     List<BranchServiceCountDTO> countTokensByBranchInRange(
             @Param("startDate") LocalDate startDate,
             @Param("endDate") LocalDate endDate,@Param("bankId") Long bankId);
     
     List<Token> findByBookingDateAndBankId(LocalDate date, Long bankId);
     @Query("SELECT new com.banktoken.dto.BranchServiceCountDTO(t.bank.name,t.branch.name,t.service.name, COUNT(t)) " +
            "FROM Token t WHERE t.bank.id = :bankId and t.bookingDate BETWEEN :startDate AND :endDate GROUP BY t.bank.name,t.branch.name,t.service.name")
     List<BranchServiceCountDTO> countTokensByServiceInRange(
             @Param("startDate") LocalDate startDate,
             @Param("endDate") LocalDate endDate,@Param("bankId") Long bankId);
     
    List<Token> findByUserIdAndBookingTimeBetweenAndHiddenFalse(Long userId, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT COUNT(t) FROM Token t where t.bank.id = :bankId and t.bookingDate = current_date")
    Long getTotalTokensByBank(@Param("bankId") Long bankId);

    @Query("SELECT COUNT(t) FROM Token t WHERE t.bank.id = :bankId and t.status = 'BOOKED' and t.bookingDate = current_date")
    Long getBookedTokensByBank(@Param("bankId") Long bankId);

    @Query("SELECT COUNT(t) FROM Token t WHERE t.bank.id = :bankId and t.status = 'SERVED' and t.bookingDate = current_date")
    Long getCompletedTokensByBank(@Param("bankId") Long bankId);
    
    @Query("SELECT COUNT(t) FROM Token t WHERE t.bank.id = :bankId and t.status = 'IN_PROCESS' and t.bookingDate = current_date")
    Long getProcessingTokensByBank(@Param("bankId") Long bankId);
    
    @Query("SELECT COUNT(t) FROM Token t WHERE t.bank.id = :bankId and t.status = 'CANCELLED' and t.bookingDate = current_date")
    Long getCancelledTokensByBank(@Param("bankId") Long bankId);
    
    @Query("SELECT COUNT(t) FROM Token t WHERE t.bank.id = :bankId and t.status = 'EXPIRED' and t.bookingDate = current_date")
    Long getExpiredTokensByBank(@Param("bankId") Long bankId);
    
    @Query("SELECT t.slotTime FROM Token t WHERE DATE(t.bookingTime) = :date AND t.status = com.banktoken.model.TokenStatus.BOOKED")
    List<String> findBookedSlotsByDate(@Param("date") LocalDate date);
    
//    @Query("SELECT COALESCE(MAX(t.tokenNumber), 0) + 1 FROM Token t WHERE t.bookingDate = :date")
//    int getNextTokenNumberForDate(@Param("date") LocalDate date);
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT COALESCE(MAX(t.tokenNumber), 0) FROM Token t WHERE t.bookingDate = :date AND t.bank.id = :bankId AND t.branch.id = :branchId AND t.service.id = :serviceId")
    int getNextTokenNumberForDateAndBranch(@Param("date") LocalDate date, @Param("bankId") Long bankId, @Param("branchId") Long branchId,@Param("serviceId") Long serviceId);


    @Modifying
    @Transactional
    @Query("UPDATE Token t SET t.hidden = true WHERE t.user.id = :userId")
    void clearHistoryByUserId(@Param("userId") Long userId);

    // Fetch only non-cleared tokens for MyTokens
    List<Token> findByUserIdAndHiddenFalse(Long userId);
}
