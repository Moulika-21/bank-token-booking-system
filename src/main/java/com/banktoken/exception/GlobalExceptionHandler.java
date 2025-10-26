package com.banktoken.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(TokenLimitExceededException.class)
    public ResponseEntity<ErrorResponse> handleTokenLimitExceeded(TokenLimitExceededException ex) {
		 System.out.println("🔥 GlobalExceptionHandler caught: " + ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT) // 409 Conflict (better than 400 for business rule violation)
                .body(new ErrorResponse(ex.getMessage()));
    }

    // Catch any other unhandled exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Something went wrong: " + ex.getMessage()));
    }

    // Wrapper for consistent error structure
    static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
