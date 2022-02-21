package com.ssafy.rtc.service;

import com.google.common.collect.Lists;
import com.ssafy.rtc.dto.RoomDto;
import com.ssafy.rtc.util.GlobalFunctions;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final StringRedisTemplate redisTemplate;

    @Override
    public RoomDto getRoom(long userid) {
        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
        RoomDto roomDto = GlobalFunctions.getRoomDto(userid, hashOperations);
        return roomDto;
    }

    @Override
    public List<RoomDto> getAllRooms() throws Exception {
        ScanOptions options = ScanOptions.scanOptions().count(10).match("room:info:*").build();

        List<String> keys = redisTemplate.execute(new RedisCallback<List<String>>() {
            public List<String> doInRedis(RedisConnection connection) throws DataAccessException {
                List<String> cacheKeys = Lists.newArrayList();
                Cursor<byte[]> cursor = (connection).scan(options);
                while (cursor.hasNext()) {
                    String value = new String(cursor.next());
                    cacheKeys.add(value);
                }
                return cacheKeys;
            }
        });

        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
        List<RoomDto> roomDtoList = new ArrayList<>();
        for(String key : keys) {
            long userid = Long.parseLong(key.substring(10));
            roomDtoList.add(GlobalFunctions.getRoomDto(userid, hashOperations));
        }

        return roomDtoList;
    }
}
