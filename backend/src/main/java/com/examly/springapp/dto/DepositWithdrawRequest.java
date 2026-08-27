
package com.examly.springapp.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class DepositWithdrawRequest {

    @NotNull
    private Long accountId;

    @Min(value = 1, message = "Amount should be greater than zero")
    private Double amount;

    private String description;

    public DepositWithdrawRequest() {
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}