package com.ssafy.rtc.controller;

import com.ssafy.rtc.dto.RoomDto;
import com.ssafy.rtc.service.RoomServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/room")
@RequiredArgsConstructor
@Api("방송정보 리스트 관련 API")
public class RoomController {

    private final RoomServiceImpl roomService;

    @ApiOperation(value = "방 정보 가져오기", notes = "해당 BroadCaster의 방 정보를 가져온다.", response = RoomDto.class)
    @GetMapping("/one/{userid}")
    public ResponseEntity<RoomDto> getRoom(@PathVariable("userid") @ApiParam(value = "방 정보를 얻어올 방의 user id", required = true) long userid) {
        RoomDto roomDto = roomService.getRoom(userid);
        return new ResponseEntity<>(roomDto, HttpStatus.CREATED);
    }

    @ApiOperation(value = "방 모든정보 가져오기", notes = "해당 BroadCaster의 방 정보를 가져온다.", response = RoomDto.class)
    @GetMapping("/all")
    public ResponseEntity<List<RoomDto>> getAllRooms() {
        List<RoomDto> roomDtoList = null;
        try {
            roomDtoList = roomService.getAllRooms();
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(roomDtoList, HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(roomDtoList, HttpStatus.OK);
    }
}
