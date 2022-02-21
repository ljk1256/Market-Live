package com.ssafy.dm.service;

import com.ssafy.dm.dto.DmDto;
import com.ssafy.dm.entity.DmEntity;

import java.util.List;
import java.util.Optional;

public interface DmService {
    DmEntity findDm(Long id); // 쪽지 클릭
    List<DmEntity> findAllDm(Long receiver_id); // 쪽지함 리스트
    DmEntity sendDm(DmDto dmDto); // 메세지 보내기
    int deleteDm(Long id); // 메세지 삭제
    DmEntity updateDm(Long id, DmDto dmDto);

}
