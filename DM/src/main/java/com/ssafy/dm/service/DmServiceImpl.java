package com.ssafy.dm.service;

import com.ssafy.dm.dto.DmDto;
import com.ssafy.dm.entity.DmEntity;
import com.ssafy.dm.entity.UserEntity;
import com.ssafy.dm.repository.DmRepository;
import com.ssafy.dm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DmServiceImpl implements DmService{

    private final DmRepository dmRepository;
    private final UserRepository userRepository;

    @Override
    public DmEntity findDm(Long id) {
        Optional<DmEntity> dmEntity = dmRepository.findById(id);
        return dmEntity.get();
    }

    @Override
    public List<DmEntity> findAllDm(Long id) {

        List<DmEntity> list = dmRepository.findByReceiverIdUserId(id);

        return list;
    }


    @Override
    @Transactional
    public DmEntity sendDm(DmDto dmDto) {
        Optional<UserEntity> sender = userRepository.findById(dmDto.getSenderId());
        Optional<UserEntity> receiver = userRepository.findById(dmDto.getReceiverId());

        DmEntity dm = new DmEntity();
        BeanUtils.copyProperties(dmDto, dm);
        dm.setReceiverId(receiver.get());
        dm.setSenderId(sender.get());

        return dmRepository.save(dm);
    }

    @Override
    @Transactional
    public int deleteDm(Long id) {
        Optional<DmEntity> dmEntity = dmRepository.findById(id);

        if(dmEntity.isPresent()) {
            dmRepository.delete(dmEntity.get());
            return 1;
        }
        return 0;
    }

    @Override
    @Transactional
    public DmEntity updateDm (Long id, DmDto dmDto) {
        Optional<DmEntity> optionalMember = dmRepository.findById(id);
        if (!optionalMember.isPresent()) {
            throw new EntityNotFoundException(
                    "Member not present in the database");
        }
        DmEntity dm = optionalMember.get();
        dm.setDm_read(dmDto.getDm_read());

        return dmRepository.save(dm);
    }
}
