package com.ssafy.auth.service;

public interface AuthService {
    boolean isValidUser (String token) throws Exception;
}
