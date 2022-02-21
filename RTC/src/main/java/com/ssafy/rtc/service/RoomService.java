package com.ssafy.rtc.service;

import com.ssafy.rtc.dto.RoomDto;

import java.util.List;

public interface RoomService {
    public RoomDto getRoom(long userid) throws Exception;
    public List<RoomDto> getAllRooms() throws Exception;
}
