package com.examly.springapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examly.springapp.model.Account;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.AccountRepository;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.repository.UserRepository;

import jakarta.validation.Validator;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @SuppressWarnings("unused")
    private final Validator validator;

    public TransactionServiceImpl(
            AccountRepository accountRepository,
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            Validator validator) {

        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.validator = validator;
    }

    // =========================================================
    // GET CURRENT LOGGED-IN USER
    // =========================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new SecurityException(
                    "User is not authenticated"
            );
        }

        String username = authentication.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Logged-in user not found"
                        ));
    }

    // =========================================================
    // CHECK WHETHER CURRENT USER IS ADMIN
    // =========================================================

    private boolean isAdmin(User user) {

        return user.getRole() != null &&
                user.getRole().equalsIgnoreCase("ADMIN");
    }

    // =========================================================
    // ACCOUNT ACCESS CHECK
    //
    // Used for VIEWING transaction history.
    //
    // ADMIN -> can view any account
    // USER  -> can view only their own account
    // =========================================================

    private void checkAccountAccess(Long accountId) {

        User currentUser = getCurrentUser();

        // -----------------------------------------------------
        // ADMIN CAN VIEW ANY ACCOUNT
        // -----------------------------------------------------

        if (isAdmin(currentUser)) {
            return;
        }

        // -----------------------------------------------------
        // FIND ACCOUNT
        // -----------------------------------------------------

        Account account = accountRepository
                .findById(accountId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Account not found"
                        ));

        // -----------------------------------------------------
        // USER CAN VIEW ONLY THEIR OWN ACCOUNT
        // -----------------------------------------------------

        if (account.getOwnerUsername() == null ||
                !account.getOwnerUsername()
                        .equalsIgnoreCase(
                                currentUser.getUsername()
                        )) {

            throw new SecurityException(
                    "You are not authorized to access this account"
            );
        }
    }

    // =========================================================
    // TRANSACTION ACCESS CHECK
    //
    // ADMIN -> NEVER allowed
    // USER  -> only own account
    // =========================================================

    private void checkTransactionAccess(Long accountId) {

        User currentUser = getCurrentUser();

        // -----------------------------------------------------
        // ADMIN CANNOT PERFORM TRANSACTIONS
        // -----------------------------------------------------

        if (isAdmin(currentUser)) {

            throw new SecurityException(
                    "Administrators cannot perform transactions"
            );
        }

        // -----------------------------------------------------
        // FIND ACCOUNT
        // -----------------------------------------------------

        Account account = accountRepository
                .findById(accountId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Account not found"
                        ));

        // -----------------------------------------------------
        // USER CAN TRANSACT ONLY ON OWN ACCOUNT
        // -----------------------------------------------------

        if (account.getOwnerUsername() == null ||
                !account.getOwnerUsername()
                        .equalsIgnoreCase(
                                currentUser.getUsername()
                        )) {

            throw new SecurityException(
                    "You are not authorized to perform transactions on this account"
            );
        }
    }

    // =========================================================
    // DEPOSIT
    //
    // USER ONLY
    // OWN ACCOUNT ONLY
    // =========================================================

    @Override
    @Transactional
    public Account deposit(
            Long accountId,
            Double amount,
            String description) {

        // Check role + account ownership
        checkTransactionAccess(accountId);

        // -----------------------------------------------------
        // AMOUNT VALIDATION
        // -----------------------------------------------------

        if (amount == null || amount <= 0) {

            throw new IllegalArgumentException(
                    "Amount should be greater than zero"
            );
        }

        // -----------------------------------------------------
        // FIND ACCOUNT
        // -----------------------------------------------------

        Account account =
                accountRepository
                        .findById(accountId)
                        .orElseThrow(() ->
                                new NoSuchElementException(
                                        "Account not found"
                                ));

        // -----------------------------------------------------
        // ADD MONEY
        // -----------------------------------------------------

        account.setBalance(
                account.getBalance() + amount
        );

        accountRepository.save(account);

        // -----------------------------------------------------
        // CREATE TRANSACTION RECORD
        // -----------------------------------------------------

        Transaction transaction =
                new Transaction();

        transaction.setAccountId(accountId);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setTransactionType("DEPOSIT");
        transaction.setTransactionDate(
                LocalDateTime.now()
        );

        transactionRepository.save(transaction);

        return account;
    }

    // =========================================================
    // WITHDRAW
    //
    // USER ONLY
    // OWN ACCOUNT ONLY
    // =========================================================

    @Override
    @Transactional
    public Account withdraw(
            Long accountId,
            Double amount,
            String description) {

        // Check role + account ownership
        checkTransactionAccess(accountId);

        // -----------------------------------------------------
        // AMOUNT VALIDATION
        // -----------------------------------------------------

        if (amount == null || amount <= 0) {

            throw new IllegalArgumentException(
                    "Amount should be greater than zero"
            );
        }

        // -----------------------------------------------------
        // FIND ACCOUNT
        // -----------------------------------------------------

        Account account =
                accountRepository
                        .findById(accountId)
                        .orElseThrow(() ->
                                new NoSuchElementException(
                                        "Account not found"
                                ));

        // -----------------------------------------------------
        // CHECK MINIMUM BALANCE
        // -----------------------------------------------------

        double remainingBalance =
                account.getBalance() - amount;

        if (remainingBalance < 500.0) {

            throw new IllegalArgumentException(
                    "Insufficient funds. Minimum balance of 500.00 must be maintained."
            );
        }

        // -----------------------------------------------------
        // REMOVE MONEY
        // -----------------------------------------------------

        account.setBalance(remainingBalance);

        accountRepository.save(account);

        // -----------------------------------------------------
        // CREATE TRANSACTION RECORD
        // -----------------------------------------------------

        Transaction transaction =
                new Transaction();

        transaction.setAccountId(accountId);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setTransactionType("WITHDRAWAL");
        transaction.setTransactionDate(
                LocalDateTime.now()
        );

        transactionRepository.save(transaction);

        return account;
    }

    // =========================================================
    // TRANSFER
    //
    // USER ONLY
    // SOURCE ACCOUNT MUST BELONG TO USER
    // =========================================================

    @Override
    @Transactional
    public Account transfer(
            Long fromAccountId,
            Long toAccountId,
            Double amount,
            String description) {

        // -----------------------------------------------------
        // CHECK USER + SOURCE ACCOUNT OWNERSHIP
        // -----------------------------------------------------

        checkTransactionAccess(fromAccountId);

        // -----------------------------------------------------
        // SAME ACCOUNT CHECK
        // -----------------------------------------------------

        if (fromAccountId.equals(toAccountId)) {

            throw new IllegalArgumentException(
                    "Cannot transfer to the same account"
            );
        }

        // -----------------------------------------------------
        // AMOUNT VALIDATION
        // -----------------------------------------------------

        if (amount == null || amount <= 0) {

            throw new IllegalArgumentException(
                    "Amount should be greater than zero"
            );
        }

        // -----------------------------------------------------
        // FIND SENDER ACCOUNT
        // -----------------------------------------------------

        Account sender =
                accountRepository
                        .findById(fromAccountId)
                        .orElseThrow(() ->
                                new NoSuchElementException(
                                        "Sender account not found"
                                ));

        // -----------------------------------------------------
        // FIND RECEIVER ACCOUNT
        // -----------------------------------------------------

        Account receiver =
                accountRepository
                        .findById(toAccountId)
                        .orElseThrow(() ->
                                new NoSuchElementException(
                                        "Recipient account not found"
                                ));

        // -----------------------------------------------------
        // CHECK MINIMUM BALANCE
        // -----------------------------------------------------

        double remainingBalance =
                sender.getBalance() - amount;

        if (remainingBalance < 500.0) {

            throw new IllegalArgumentException(
                    "Insufficient funds. Minimum balance of 500.00 must be maintained."
            );
        }

        // -----------------------------------------------------
        // DEDUCT FROM SENDER
        // -----------------------------------------------------

        sender.setBalance(remainingBalance);

        // -----------------------------------------------------
        // ADD TO RECEIVER
        // -----------------------------------------------------

        receiver.setBalance(
                receiver.getBalance() + amount
        );

        // -----------------------------------------------------
        // SAVE BOTH ACCOUNTS
        // -----------------------------------------------------

        accountRepository.save(sender);
        accountRepository.save(receiver);

        // -----------------------------------------------------
        // CREATE TRANSFER TRANSACTION
        // -----------------------------------------------------

        Transaction transaction =
                new Transaction();

        transaction.setAccountId(fromAccountId);
        transaction.setRecipientAccountId(toAccountId);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setTransactionType("TRANSFER");
        transaction.setTransactionDate(
                LocalDateTime.now()
        );

        transactionRepository.save(transaction);

        return sender;
    }

    // =========================================================
    // TRANSACTION HISTORY
    //
    // ADMIN + USER
    //
    // ADMIN -> can view any account history
    // USER  -> can view only own account history
    // =========================================================

    @Override
    public List<Transaction> getTransactionHistory(
            Long accountId) {

        // ADMIN is allowed here.
        // USER is checked for ownership.
        checkAccountAccess(accountId);

        return transactionRepository
                .findByAccountIdOrderByTransactionDateDesc(
                        accountId
                );
    }
}