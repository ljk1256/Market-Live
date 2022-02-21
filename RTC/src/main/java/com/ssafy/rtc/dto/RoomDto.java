package com.ssafy.rtc.dto;

import lombok.Data;

@Data
public class RoomDto {
    private long userid;
    private String title;
    private String category;
    private String nickname;
    private String introduce;
    private String starttime;
    private String endtime;
    private String thumbnail;
}
