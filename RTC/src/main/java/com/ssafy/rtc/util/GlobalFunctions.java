package com.ssafy.rtc.util;

import com.ssafy.rtc.dto.RoomDto;
import org.springframework.data.redis.core.HashOperations;

public class GlobalFunctions {

    public static String generateRoomInfoKey(long userid) {
        StringBuffer sb = new StringBuffer();
        sb.append(GlobalConstants.NAMESPACAE_ROOM)
                .append(":")
                .append(GlobalConstants.NAMESPACE_INFO)
                .append(":")
                .append(userid);
        return sb.toString();
    }

    public static String generateRoomViewersKey(long userid) {
        StringBuffer sb = new StringBuffer();
        sb.append(GlobalConstants.NAMESPACAE_ROOM)
                .append(":")
                .append(GlobalConstants.NAMESPACE_VIEWERS)
                .append(":")
                .append(userid);
        return sb.toString();
    }

    public static RoomDto getRoomDto(long userid, HashOperations<String, Object, Object> hashOperations) {
        String key = generateRoomInfoKey(userid);
        RoomDto roomDto = new RoomDto();
        roomDto.setUserid(userid);
        roomDto.setTitle(hashOperations.get(key, GlobalConstants.ROOMDTO_TITLE).toString());
        roomDto.setNickname(hashOperations.get(key, GlobalConstants.ROOMDTO_NICKNAME).toString());
        roomDto.setCategory(hashOperations.get(key, GlobalConstants.ROOMDTO_CATEGORY).toString());
        roomDto.setIntroduce(hashOperations.get(key, GlobalConstants.ROOMDTO_INTRODUCE).toString());
        roomDto.setStarttime(hashOperations.get(key, GlobalConstants.ROOMDTO_STARTTIME).toString());
        roomDto.setEndtime(hashOperations.get(key, GlobalConstants.ROOMDTO_ENDTIME).toString());
        roomDto.setThumbnail(hashOperations.get(key, GlobalConstants.ROOMDTO_THUMBNAIL).toString());
        return roomDto;
    }
}
