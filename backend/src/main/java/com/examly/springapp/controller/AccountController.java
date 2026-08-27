package com.examly.springapp.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.dto.CreateAccountRequest;
import com.examly.springapp.model.Account;
import com.examly.springapp.service.AccountService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:8081")
@SecurityRequirement(name = "bearerAuth")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    // =====================================================
    // ADMIN - CREATE ACCOUNT
    // =====================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Account> createAccount(
            @Valid @RequestBody CreateAccountRequest request) {

        Account account = new Account();

        account.setAccountNumber(
                request.getAccountNumber()
        );

        account.setAccountHolderName(
                request.getAccountHolderName()
        );

        account.setBalance(
                request.getBalance()
        );

        account.setAccountType(
                request.getAccountType()
        );

        account.setOwnerUsername(
                request.getOwnerUsername()
        );

        Account savedAccount =
                accountService.createAccount(account);

        return new ResponseEntity<>(
                savedAccount,
                HttpStatus.CREATED
        );
    }

    // =====================================================
    // USER - MY ACCOUNT
    // =====================================================

    @GetMapping("/my-account")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Account> getMyAccount(
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                accountService.getAccountByOwnerUsername(username)
        );
    }

    // =====================================================
    // ADMIN + USER - ALL ACCOUNTS
    //
    // USER needs this to select a transfer recipient.
    // =====================================================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Account>> getAllAccounts() {

        return ResponseEntity.ok(
                accountService.getAllAccounts()
        );
    }

    // =====================================================
    // ADMIN + USER - ACCOUNT DETAILS
    //
    // USER needs this after deposit/withdraw/transfer.
    // =====================================================

    @GetMapping("/{accountId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Account> getAccountById(
            @PathVariable Long accountId) {

        return ResponseEntity.ok(
                accountService.getAccountById(accountId)
        );
    }
}