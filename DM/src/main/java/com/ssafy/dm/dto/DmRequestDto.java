package com.ssafy.dm.dto;

import lombok.Data;

@Data
public class DmRequestDto {

    private int dm_id; // pk

    private String f_sender_id; // 송신자
    private String f_receiver_id; // 수신자
    private Boolean dm_read; // 수신여부
    private String dm_time; // 도착 시간
    private String dm_title; // 제목
    private String dm_msg; // 내용


}
