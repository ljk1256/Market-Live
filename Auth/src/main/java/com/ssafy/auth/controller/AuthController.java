package com.ssafy.auth.controller;

import com.ssafy.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/falsify") // 토큰 유효성, 위변조 검사
    public ResponseEntity<Boolean> checkToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String bearerToken) {
        String token = bearerToken.replace("Bearer ","");//기본적으로 header에 Bearer를 먼저 넣어주고 한다.
        boolean result = false;
        try{
            result = authService.isValidUser(token);
        }
        catch (Exception e) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
