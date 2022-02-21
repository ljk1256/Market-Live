package com.ssafy.rtc.service;

import com.ssafy.rtc.dto.RoomDto;
import com.ssafy.rtc.util.GlobalConstants;
import com.ssafy.rtc.util.GlobalFunctions;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BroadCasterServiceImpl implements BroadCasterService {

    private final StringRedisTemplate redisTemplate;

    private final String uploadUrl = "classpath:static/thumbnails/";

    @Override
    //public void createRoom(RoomDto roomDto, MultipartFile multipartFile) throws Exception{
        public void createRoom(RoomDto roomDto) throws Exception{
//        if(!multipartFile.isEmpty()) { // && !multipartFile.isEmpty()
//            //String path = new ClassPathResource("/static").getFile().getAbsolutePath() + "\\thumbnails"; // 로컬 확인용
//            String path = "/broad";
//            String contentType = multipartFile.getContentType();
//            File file = new File(path);
//            String extension = null;
//
//            if(!file.exists()){
//                file.mkdirs();
//            }
//
//            if(contentType.contains("jpeg") || contentType.contains("jpg")) extension = ".jpg";
//            else if(contentType.contains("png")) extension = ".png";
//            else if(contentType.contains("gif")) extension = ".gif";
//
//            path = path + "/" + roomDto.getUserid() + extension; // 로컬 확인용
//            file = new File(path);
//            roomDto.setThumbnail(path);
//
//            multipartFile.transferTo(file);
//        }
        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
        String KEY = GlobalFunctions.generateRoomInfoKey(roomDto.getUserid());
        hashOperations.putAll(KEY, roomDtoToMap(roomDto));
    }

    @Override
    public byte[] getThumbnail(Long userid) {
        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
        RoomDto roomDto = GlobalFunctions.getRoomDto(userid, hashOperations);

        String path = roomDto.getThumbnail();
        System.out.println(path);

        if(roomDto.getThumbnail() != null) {
            try {
                InputStream imageStream = new FileInputStream(path);
                byte[] imageByteArray = IOUtils.toByteArray(imageStream);
                imageStream.close();
                return imageByteArray;
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return new byte[0];
    }


    @Override
    public void modifyRoom(RoomDto roomDto) {
        // TODO: 사진 수정

        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
        String KEY = GlobalFunctions.generateRoomInfoKey(roomDto.getUserid());
        hashOperations.putAll(KEY, roomDtoToMap(roomDto));
    }

//    @Override
//    public void blowRoom(long userid) {
//        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
//        String KEY = GlobalFunctions.generateRoomInfoKey(userid);
//        redisTemplate.delete(KEY);
//    }

    private Map<String, Object> roomDtoToMap(RoomDto roomDto) {
        Map<String, Object> map = new HashMap<>();
        map.put(GlobalConstants.ROOMDTO_TITLE, roomDto.getTitle());
        map.put(GlobalConstants.ROOMDTO_NICKNAME, roomDto.getNickname());
        map.put(GlobalConstants.ROOMDTO_CATEGORY, roomDto.getCategory());
        map.put(GlobalConstants.ROOMDTO_INTRODUCE, roomDto.getIntroduce());
        map.put(GlobalConstants.ROOMDTO_STARTTIME, roomDto.getStarttime());
        map.put(GlobalConstants.ROOMDTO_ENDTIME, roomDto.getEndtime());
        map.put(GlobalConstants.ROOMDTO_THUMBNAIL, roomDto.getThumbnail());
        return map;
    }
}
