package com.ssafy.rtc.controller;

import com.ssafy.rtc.dto.RoomDto;
import com.ssafy.rtc.service.BroadCasterServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/broad")
@RequiredArgsConstructor
@Api("BraodCaster 컨트롤러 API ver 1.0")
public class BroadCasterController {

    private final BroadCasterServiceImpl broadCasterService;

    @ApiOperation(value = "방 생성", notes = "BroadCaster가 방을 새로 만든다.", response = String.class)
    @PostMapping("/create-room")
    //public ResponseEntity<String> createRoom(@RequestBody @ApiParam(value = "방 정보", required = true) RoomDto roomDto, @RequestParam MultipartFile multipartFile) {
    public ResponseEntity<String> createRoom(@RequestBody @ApiParam(value = "방 정보", required = true) RoomDto roomDto) {
        try {
//            String origFilename = files.getOriginalFilename();
//            String filename = new MD5Generator(origFilename).toString();
//            /* 실행되는 위치의 'files' 폴더에 파일이 저장됩니다. */
//            String savePath = System.getProperty("user.dir") + "\\RTC\\src\\main\\resources\\image"; // 경로 설정
//            /* 파일이 저장되는 폴더가 없으면 폴더를 생성합니다. */
//            if (!new File(savePath).exists()) {
//                try{
//                    new File(savePath).mkdir();
//                }
//                catch(Exception e){
//                    e.getStackTrace();
//                }
//            }
//            String filePath = savePath + "\\" + filename;
//            files.transferTo(new File(filePath));
//            roomDto.setThumbnail(filePath);

            //broadCasterService.createRoom(roomDto, multipartFile);
            broadCasterService.createRoom(roomDto);
        } catch (Exception e) {
            return new ResponseEntity<>("create room failed", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("create room", HttpStatus.CREATED);
    }

    @GetMapping(value = "/thumbnail/{userid}", produces = MediaType.IMAGE_JPEG_VALUE) // 유저 썸네일 요청
    public ResponseEntity<byte[]> getProfile(@PathVariable long userid) {
        byte[] result;
        try {
            result = broadCasterService.getThumbnail(userid);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        System.out.println("여기도됨");
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @ApiOperation(value = "방 수정", notes = "BroadCaster가 방 정보를 수정한다.", response = String.class)
    @PutMapping("/modify-room")
    public ResponseEntity<String> modifyRoom(@RequestBody @ApiParam(value = "방을 수정하기 위한 방 정보", required = true) RoomDto roomDto) {
        try {
            broadCasterService.modifyRoom(roomDto);
        } catch (Exception e) {
            return new ResponseEntity<>("modify room failed", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("modify room", HttpStatus.CREATED);
    }

//    @ApiOperation(value = "방 폭파", notes = "BroadCaster가 방을 없앤다.", response = String.class)
//    @DeleteMapping("/blow-room")
//    public ResponseEntity<String> blowRoom(@RequestParam @ApiParam(value = "폭파할 방의 user id", required = true) long userid) {
//        try{
//            broadCasterService.blowRoom(userid);
//        }catch(Exception e){
//            return new ResponseEntity<>("blow room failed", HttpStatus.BAD_REQUEST);
//        }
//        return new ResponseEntity<>("blow room", HttpStatus.CREATED);
//    }
}
