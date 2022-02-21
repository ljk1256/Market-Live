package com.ssafy.dm.dto;

import com.ssafy.dm.entity.DmEntity;
import com.ssafy.dm.entity.UserEntity;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DmDto {
    private Long dm_id; // pk

    private Long senderId; // 송신자
    private Long receiverId; // 수신자
    private Boolean dm_read; // 수신여부
    private String dm_time; // 도착 시간
    private String dm_title; // 제목
    private String dm_msg; // 내용

    @Builder
    public DmDto(Long dm_id, Long senderId, Long receiverId, Boolean dm_read, String dm_time, String dm_title, String dm_msg) {
        this.dm_id = dm_id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.dm_read = dm_read;
        this.dm_time = dm_time;
        this.dm_title = dm_title;
        this.dm_msg = dm_msg;
    }

//    public DmEntity toEntity() {
//        return DmEntity.builder()
//                .dm_id((long) dm_id)
//                .senderId(senderId)
//                .receiverId(receiverId)
//                .dm_read(dm_read)
//                .dm_time(dm_time)
//                .dm_title(dm_title)
//                .dm_msg(dm_msg)
//                .build();
//    }
}
