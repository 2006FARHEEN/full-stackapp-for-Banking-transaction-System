package com.examly.springapp.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.dto.DepositWithdrawRequest;
import com.examly.springapp.dto.TransferRequest;
import com.examly.springapp.model.Account;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.service.TransactionService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:8081")
@SecurityRequirement(name = "bearerAuth")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // ================= DEPOSIT =================

    @PostMapping("/deposit")
    public ResponseEntity<Account> deposit(
            @Valid @RequestBody DepositWithdrawRequest request) {

        Account account = transactionService.deposit(
                request.getAccountId(),
                request.getAmount(),
                request.getDescription()
        );

        return ResponseEntity.ok(account);
    }

    // ================= WITHDRAW =================

    @PostMapping("/withdraw")
    public ResponseEntity<Account> withdraw(
            @Valid @RequestBody DepositWithdrawRequest request) {

        Account account = transactionService.withdraw(
                request.getAccountId(),
                request.getAmount(),
                request.getDescription()
        );

        return ResponseEntity.ok(account);
    }

    // ================= TRANSFER =================

    @PostMapping("/transfer")
    public ResponseEntity<Account> transfer(
            @Valid @RequestBody TransferRequest request) {

        Account account = transactionService.transfer(
                request.getFromAccountId(),
                request.getToAccountId(),
                request.getAmount(),
                request.getDescription()
        );

        return ResponseEntity.ok(account);
    }

    // ================= TRANSACTION HISTORY =================

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Transaction>> getTransactionHistory(
            @PathVariable Long accountId) {

        return ResponseEntity.ok(
                transactionService.getTransactionHistory(accountId)
        );
    }
}