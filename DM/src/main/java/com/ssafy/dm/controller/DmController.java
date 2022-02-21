package com.ssafy.dm.controller;

import com.ssafy.dm.dto.DmDto;
import com.ssafy.dm.entity.DmEntity;
import com.ssafy.dm.service.DmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/dm")
@RequiredArgsConstructor
public class DmController {

    private final DmService dmService;

    @PostMapping("/create") // 메세지 만들기 완료
    public ResponseEntity<DmEntity> creatDmMessage(@RequestBody DmDto dmDto) {

        DmEntity dm = dmService.sendDm(dmDto);

        if(dm != null) {
            return new ResponseEntity<>(dm, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

    @GetMapping("/{id}") // 메세지 하나 확인(dm_id), 완료
    public ResponseEntity<DmEntity> findById(@PathVariable("id") long id) {

        DmEntity dm = dmService.findDm(id);

        if(dm != null) {
            return new ResponseEntity<>(dm, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/all/{id}") // 메세지 전체 조회(receiver_id), 완료
    public ResponseEntity<List<DmEntity>> findAllByfReceiverId(@PathVariable("id") Long id) {
        List<DmEntity> dm = dmService.findAllDm(id);

        if(dm != null) {
            return new ResponseEntity<>(dm, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}") // 메세지 삭제(dm_id), 완료
    public ResponseEntity<String> deleteDm(@PathVariable("id") long id) {

        try {
            dmService.deleteDm(id);
        }
        catch (Exception e) {
            return new ResponseEntity<>("메세지 삭제 실패", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>("메세지 삭제 완료", HttpStatus.OK);

    }

    @PatchMapping("/read/{dmId}") // 메세지 읽음
    public ResponseEntity<DmEntity> updateDm (@RequestBody DmDto dmDto, @PathVariable("dmId") Long dmId) {
        return ResponseEntity.ok(dmService.updateDm(dmId, dmDto));
    }

}
