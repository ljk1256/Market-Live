package com.ssafy.auth.token;

import com.ssafy.auth.entity.User;
import com.ssafy.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException { // 오버로딩 메소드 호출
        return loadUserByUsername(Long.parseLong(username));
    }

    public UserDetails loadUserByUsername(Long userid) throws UsernameNotFoundException { // 유저 아이디로 검색해서 유저 디테일로 반환
        Optional<User> user = Optional.ofNullable(userRepository.findByUserid(userid))
                .orElseThrow(()-> new UsernameNotFoundException("존재하지 않는 유저입니다."));
        return UserDetailsImpl.build(user.get());
    }
}
