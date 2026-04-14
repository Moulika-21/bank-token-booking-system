package com.banktoken.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordDTO {
	private String oldPassword;
    private String newPassword;
}
