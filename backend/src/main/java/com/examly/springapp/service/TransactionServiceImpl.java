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
    // CURRENT LOGGED-IN USER
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

        String username =
                authentication.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Logged-in user not found"
                        ));
    }

    // =========================================================
    // CHECK ADMIN
    // =========================================================

    private boolean isAdmin(User user) {

        return user.getRole() != null &&
               user.getRole().equalsIgnoreCase("ADMIN");
    }

    // =========================================================
    // ACCOUNT ACCESS CHECK
    // =========================================================

    private void checkAccountAccess(Long accountId) {

        User currentUser = getCurrentUser();

        // ADMIN can access every account
        if (isAdmin(currentUser)) {
            return;
        }

        /*
         * For USER:
         *
         * The account holder name must match
         * the logged-in username.
         *
         * If your accountHolderName is the user's
         * actual name rather than username, we will
         * change this later to a proper User-Account
         * relationship.
         */

        Account account = accountRepository
                .findById(accountId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Account not found"
                        ));

        if (!account.getAccountHolderName()
                .equalsIgnoreCase(currentUser.getUsername())) {

            throw new SecurityException(
                    "You are not authorized to access this account"
            );
        }
    }

    // =========================================================
    // DEPOSIT
    // =========================================================

    @Override
    @Transactional
    public Account deposit(
            Long accountId,
            Double amount,
            String description) {

        checkAccountAccess(accountId);

        if (amount == null || amount <= 0) {

            throw new IllegalArgumentException(
                    "Amount should be greater than zero"
            );
        }

        Account account =
                accountRepository.findById(accountId)
                        .orElseThrow(() ->
                                new NoSuchElementException(
                                        "Account not found"
                                ));

        account.setBalance(
                account.getBalance() + amount
        );

        accountRepository.save(account);

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
    // =========================================================

    @Override
    @Transactional
    public Account withdraw(
            Long accountId,
            Double amount,
            String description) {

        checkAccountAccess(accountId);

        if (amount == null || amount <= 0) {

            throw new IllegalArgumentException(
                    "Amount should be greater than zero"
            );
        }

        Account account =
                accountRepository.findById(accountId)
                        .orElseThrow(() ->
                                new NoSuchElementException(
                                        "Account not found"
                                ));

        double remainingBalance =
                account.getBalance() - amount;

        if (remainingBalance < 500.0) {

            throw new IllegalArgumentException(
                    "Insufficient funds. Minimum balance of 500.00 must be maintained."
            );
        }

        account.setBalance(remainingBalance);

        accountRepository.save(account);

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
    // =========================================================

    @Override
    @Transactional
    public Account transfer(
            Long fromAccountId,
            Long toAccountId,
            Double amount,
            String description) {

        // User must own the SOURCE account
        checkAccountAccess(fromAccountId);

        if (fromAccountId.equals(toAccountId)) {

            throw new IllegalArgumentException(
                    "Cannot transfer to the same account"
            );
        }

        if (amount == null || amount <= 0) {

            throw new IllegalArgumentException(
                    "Amount should be greater than zero"
            );
        }

        Account sender =
                accountRepository.findById(fromAccountId)
                        .orElseThrow(() ->
                                new NoSuchElementException(
                                        "Sender account not found"
                                ));

        Account receiver =
                accountRepository.findById(toAccountId)
                        .orElseThrow(() ->
                                new NoSuchElementException(
                                        "Recipient account not found"
                                ));

        double remainingBalance =
                sender.getBalance() - amount;

        if (remainingBalance < 500.0) {

            throw new IllegalArgumentException(
                    "Insufficient funds. Minimum balance of 500.00 must be maintained."
            );
        }

        sender.setBalance(remainingBalance);

        receiver.setBalance(
                receiver.getBalance() + amount
        );

        accountRepository.save(sender);
        accountRepository.save(receiver);

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
    // =========================================================

    @Override
    public List<Transaction> getTransactionHistory(
            Long accountId) {

        // IMPORTANT:
        // This prevents USER from viewing another
        // user's transaction history.

        checkAccountAccess(accountId);

        return transactionRepository
                .findByAccountIdOrderByTransactionDateDesc(
                        accountId
                );
    }
}