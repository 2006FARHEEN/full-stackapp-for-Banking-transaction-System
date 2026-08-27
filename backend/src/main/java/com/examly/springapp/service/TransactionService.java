package com.examly.springapp.service;

import java.util.List;

import com.examly.springapp.model.Account;
import com.examly.springapp.model.Transaction;

public interface TransactionService {

    Account deposit(Long accountId,
                    Double amount,
                    String description);

    Account withdraw(Long accountId,
                     Double amount,
                     String description);

    Account transfer(Long fromAccountId,
                     Long toAccountId,
                     Double amount,
                     String description);

    List<Transaction> getTransactionHistory(Long accountId);

}