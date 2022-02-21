package com.ssafy.auth.entity;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@RequiredArgsConstructor
public enum Authority implements GrantedAuthority {
    USER("ROLE_USER", "사용자권한");

    private final String code;
    private final String description;

    @Override
    public String getAuthority() {
        return name();
    }
}
