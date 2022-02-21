package com.ssafy.dm.repository;

import com.ssafy.dm.entity.DmEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DmRepository extends JpaRepository<DmEntity, Long> {
    List<DmEntity> findByReceiverIdUserId(Long id);
}
