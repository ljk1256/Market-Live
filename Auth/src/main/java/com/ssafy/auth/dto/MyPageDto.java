package com.ssafy.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyPageDto {
    private long userid;
    private String email;
    private String phone;
    private double manner;
    private String name;
    private String nickname;
    private String thumnailroot;
    private String oneline;
}
