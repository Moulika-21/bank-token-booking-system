package com.banktoken.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "banks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bank {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;             

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIfscPrefix() {
		return ifscPrefix;
	}

	public void setIfscPrefix(String ifscPrefix) {
		this.ifscPrefix = ifscPrefix;
	}

	@Column(unique = true, nullable = true)
    private String ifscPrefix;   
}
