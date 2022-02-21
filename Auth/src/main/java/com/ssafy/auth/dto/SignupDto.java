package com.ssafy.auth.dto;

import lombok.Data;

@Data
public class SignupDto {
    private String email;
    private String password;
    private String phone;
    private String name;
    private String nickname;
}
