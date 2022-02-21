package com.ssafy.dm.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "user")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "USER_EMAIL", unique = true)
    private String user_email;
    private String user_password;

    private String user_phone;
    private double user_manner;
    private String user_name;
    private String user_nickname;
    private String user_thumbnail_root;
    private String user_one_line;

    @OneToMany(mappedBy = "senderId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonBackReference(value = "dmEntityList")
    List<DmEntity> dmEntitySendList = new ArrayList<>();

    @OneToMany(mappedBy = "receiverId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonBackReference(value = "dmEntityList1")
    List<DmEntity> dmEntityReceiverList = new ArrayList<>();

    @Builder
    public UserEntity(Long userId, String user_email, String user_password, String user_phone, double user_manner, String user_name, String user_nickname, String user_thumbnail_root, String user_one_line) {
        this.userId = userId;
        this.user_email = user_email;
        this.user_password = user_password;
        this.user_phone = user_phone;
        this.user_manner = user_manner;
        this.user_name = user_name;
        this.user_nickname = user_nickname;
        this.user_thumbnail_root = user_thumbnail_root;
        this.user_one_line = user_one_line;
    }
}
