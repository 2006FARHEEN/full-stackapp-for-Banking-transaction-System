package com.examly.springapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    private Long accountId;

    private Double amount;

    private String transactionType;

    private String description;

    private LocalDateTime transactionDate;

    private Long recipientAccountId;

    public Transaction() {
        this.transactionDate = LocalDateTime.now();
    }

    public Transaction(Long transactionId, Long accountId,
                       Double amount, String transactionType,
                       String description,
                       LocalDateTime transactionDate,
                       Long recipientAccountId) {

        this.transactionId = transactionId;
        this.accountId = accountId;
        this.amount = amount;
        this.transactionType = transactionType;
        this.description = description;
        this.transactionDate = transactionDate;
        this.recipientAccountId = recipientAccountId;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
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

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getDescription() {
        return description;
    }

public void setDescription(String description) {
this.description = description;
}

public LocalDateTime getTransactionDate() {
return transactionDate;
}

public void setTransactionDate(LocalDateTime transactionDate) {
this.transactionDate = transactionDate;
}

public Long getRecipientAccountId() {
return recipientAccountId;
}

public void setRecipientAccountId(Long recipientAccountId) {
this.recipientAccountId = recipientAccountId;
}
}