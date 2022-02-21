package com.ssafy.auth.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Builder
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "USER")
public class User {
    @Id
    @Column(name = "USER_ID") // 단방향 설정 시 확인 필요
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userid;

    @Column(name = "USER_EMAIL", unique = true)
    private String email;

    @NonNull
    @Column(name = "USER_PASSWORD")
    private String password;

    @NonNull
    @Column(name = "USER_PHONE")
    private String phone;

    @Column(name = "USER_MANNER")
    private double manner;

    @NonNull
    @Column(name = "USER_NAME")
    private String name;

    @NonNull
    @Column(name = "USER_NICKNAME")
    private String nickname;

    @Column(name = "USER_THUMBNAIL_ROOT")
    private String thumnailroot;

    @Column(name = "USER_ONELINE")
    private String oneline;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(
            name="USER_AUTHORITIES",
            joinColumns = @JoinColumn(name = "USER_ID")
    )
    private Set<Authority> authority;

}
