package com.ssafy.rtc.service;

import com.ssafy.rtc.dto.RoomDto;

public interface ViewerService {

    RoomDto enterRoom(long broad_userid, long viewer_userid);
    //void exitRoom(long broad_userid, long viewer_userid);

}
