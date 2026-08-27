package com.examly.springapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @Column(unique = true, nullable = false)
    @Pattern(
        regexp = "\\d{10}",
        message = "Account number must be exactly 10 digits"
    )
    private String accountNumber;

    @NotBlank(message = "Account holder name is required")
    private String accountHolderName;

    @DecimalMin(
        value = "500.0",
        message = "Minimum balance should be 500"
    )
    private Double balance;

    @NotBlank(message = "Account type is required")
    @Pattern(
        regexp = "Savings|Checking",
        message = "Account type must be Savings or Checking"
    )
    private String accountType;

    /*
     * Username of the user who owns this account.
     *
     * This is used to make sure a USER can see
     * only their own account.
     */
    @Column(nullable = true)
    private String ownerUsername;

    private LocalDateTime createdDate;

    public Account() {
    }

    public Account(
            Long accountId,
            String accountNumber,
            String accountHolderName,
            Double balance,
            String accountType,
            String ownerUsername,
            LocalDateTime createdDate) {

        this.accountId = accountId;
        this.accountNumber = accountNumber;
        this.accountHolderName = accountHolderName;
        this.balance = balance;
        this.accountType = accountType;
        this.ownerUsername = ownerUsername;
        this.createdDate = createdDate;
    }

    @PrePersist
    public void onCreate() {

        if (this.createdDate == null) {
            this.createdDate = LocalDateTime.now();
        }
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}