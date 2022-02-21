package com.ssafy.dm.repository;

import com.ssafy.dm.entity.DmEntity;
import com.ssafy.dm.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long>  {

}
