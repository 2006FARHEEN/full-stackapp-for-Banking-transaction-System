package com.examly.springapp.service;

import java.util.List;

import com.examly.springapp.model.Account;

public interface AccountService {

    Account createAccount(Account account);

    Account getAccountById(Long accountId);

    List<Account> getAllAccounts();

    Account getAccountByOwnerUsername(String username);
}