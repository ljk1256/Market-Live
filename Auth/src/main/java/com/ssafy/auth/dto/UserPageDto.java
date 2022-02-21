package com.ssafy.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPageDto {
    private long userId;
    private String email;
    private String name;
    private String nickname;
    private String oneline;
}
