package com.ssafy.rtc.controller;

import com.ssafy.rtc.dto.RoomDto;
import com.ssafy.rtc.service.ViewerService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/viewer")
@RequiredArgsConstructor
@Api("Viewer 컨트롤러 API ver 1.0")
public class ViewerController {

    private final ViewerService viewerService;

    @ApiOperation(value = "방 입장", notes = "시청자는 방에 입장한다. 방장의 방 정보를 가져온다.", response = RoomDto.class)
    @GetMapping("/enter-room/{userid}")
    public ResponseEntity<RoomDto> enterRoom(@PathVariable("userid") @ApiParam(value = "방장의 user id", required = true) long broad_userid,
                                             @RequestParam @ApiParam(value = "viewer의 user id", required = true) long viewer_userid) {
        RoomDto roomDto = viewerService.enterRoom(broad_userid, viewer_userid);
        return new ResponseEntity<>(roomDto, HttpStatus.CREATED);
    }

//    @ApiOperation(value = "방 나가기", notes = "시청자는 방에서 나간다.", response = String.class)
//    @DeleteMapping("/exit-room")
//    public ResponseEntity<String> exitRoom(@RequestParam @ApiParam(value = "방장의 user id", required = true) long broad_userid,
//                                           @RequestParam @ApiParam(value = "viewer의 user id", required = true) long viewer_userid) {
//        try {
//            viewerService.exitRoom(broad_userid, viewer_userid);
//        } catch (Exception e) {
//            return new ResponseEntity<>("exit room failed", HttpStatus.BAD_REQUEST);
//        }
//        return new ResponseEntity<>("exit room", HttpStatus.CREATED);
//    }
}
