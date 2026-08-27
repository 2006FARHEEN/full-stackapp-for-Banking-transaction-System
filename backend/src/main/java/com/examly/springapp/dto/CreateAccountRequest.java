package com.examly.springapp.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CreateAccountRequest {

    @NotBlank(message = "Account number is required")
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

    @NotBlank(message = "Owner username is required")
    private String ownerUsername;

    public CreateAccountRequest() {
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
}