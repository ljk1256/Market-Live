package com.ssafy.rtc.service;

import com.ssafy.rtc.dto.RoomDto;

public interface BroadCasterService {

    //void createRoom(RoomDto roomDto, MultipartFile multipartFile) throws Exception;
    void createRoom(RoomDto roomDto) throws Exception;

    byte[] getThumbnail(Long userid) throws Exception;

    void modifyRoom(RoomDto roomDto) throws Exception;

}
