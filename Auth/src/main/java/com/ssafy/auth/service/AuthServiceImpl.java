package com.ssafy.auth.service;

import com.ssafy.auth.token.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean isValidUser(String token) throws Exception {
        if (jwtTokenProvider.vaildateToken(token)) return true;
        else return false;
    }
}
