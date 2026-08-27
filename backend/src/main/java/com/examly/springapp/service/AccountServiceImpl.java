package com.examly.springapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.examly.springapp.model.Account;
import com.examly.springapp.repository.AccountRepository;

import jakarta.validation.Validator;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    @SuppressWarnings("unused")
    private final Validator validator;

    public AccountServiceImpl(
            AccountRepository accountRepository,
            Validator validator) {

        this.accountRepository = accountRepository;
        this.validator = validator;
    }

    // =====================================================
    // CREATE ACCOUNT
    // =====================================================

    @Override
    public Account createAccount(Account account) {

        // Account number validation
        if (account.getAccountNumber() == null ||
                !account.getAccountNumber().matches("\\d{10}")) {

            throw new IllegalArgumentException(
                    "Invalid account number"
            );
        }

        // Unique account number validation
        if (accountRepository
                .findByAccountNumber(account.getAccountNumber())
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Account number already exists"
            );
        }

        // Account holder validation
        if (account.getAccountHolderName() == null ||
                account.getAccountHolderName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Account holder name is required"
            );
        }

        // Minimum balance validation
        if (account.getBalance() == null ||
                account.getBalance() < 500) {

            throw new IllegalArgumentException(
                    "Minimum balance should be 500"
            );
        }

        // Account type validation
        if (account.getAccountType() == null ||
                !(account.getAccountType().equals("Savings")
                        || account.getAccountType().equals("Checking"))) {

            throw new IllegalArgumentException(
                    "Invalid account type"
            );
        }

        // Owner validation
        if (account.getOwnerUsername() == null ||
                account.getOwnerUsername().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Owner username is required"
            );
        }

        account.setCreatedDate(LocalDateTime.now());

        return accountRepository.save(account);
    }

    // =====================================================
    // GET ACCOUNT BY ID
    // ADMIN ONLY
    // =====================================================

    @Override
    public Account getAccountById(Long accountId) {

        return accountRepository
                .findById(accountId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Account not found"
                        ));
    }

    // =====================================================
    // GET ALL ACCOUNTS
    // ADMIN ONLY
    // =====================================================

    @Override
    public List<Account> getAllAccounts() {

        return accountRepository.findAll();
    }

    // =====================================================
    // GET USER'S OWN ACCOUNT
    // =====================================================

    @Override
    public Account getAccountByOwnerUsername(String username) {

        return accountRepository
                .findByOwnerUsername(username)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Account not found for user: " + username
                        ));
    }
}