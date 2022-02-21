package com.ssafy.rtc.service;

import com.ssafy.rtc.dto.RoomDto;
import com.ssafy.rtc.util.GlobalFunctions;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ViewerServiceImpl implements ViewerService{

    private final StringRedisTemplate redisTemplate;

    @Override
    public RoomDto enterRoom(long broad_userid, long viewer_userid) {
        // room 정보 가져오기
        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
        RoomDto roomDto = GlobalFunctions.getRoomDto(broad_userid, hashOperations);
        
        // room 시청자 정보 추가
        SetOperations<String, String> setOperations = redisTemplate.opsForSet();
        String VIEWERS_KEY = GlobalFunctions.generateRoomViewersKey(broad_userid);
        setOperations.add(VIEWERS_KEY, String.valueOf(viewer_userid));
        
        return roomDto;
    }

//    @Override
//    public void exitRoom(long broad_userid, long viewer_userid) {
//        // room 시청자 정보 제거
//        SetOperations<String, String> setOperations = redisTemplate.opsForSet();
//        String VIEWERS_KEY = GlobalFunctions.generateRoomViewersKey(broad_userid);
//        setOperations.remove(VIEWERS_KEY, String.valueOf(viewer_userid));
//    }

}
