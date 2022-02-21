package com.ssafy.auth.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.ssafy.auth.dto.*;
import com.ssafy.auth.entity.Authority;
import com.ssafy.auth.entity.User;
import com.ssafy.auth.repository.UserRepository;
import com.ssafy.auth.token.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    private final String uploadUrl = "classpath:static/thumbnails/";

    @Override
    public String saveUser(SignupDto signupDto) {
        if(!userRepository.existsByEmail(signupDto.getEmail())) {
            signupDto.setPassword(passwordEncoder.encode(signupDto.getPassword()));
            try {
                Set<Authority> authorities = new HashSet<>();
                authorities.add(Authority.USER);
                User user = new User().builder()
                        .email(signupDto.getEmail())
                        .password(signupDto.getPassword())
                        .phone(signupDto.getPhone())
                        .name(signupDto.getName())
                        .nickname(signupDto.getNickname())
                        .authority(authorities)
                        .build();
                userRepository.save(user);
            }
            catch (Exception e) {
                throw e;
            }
        }
        return "Success";
    }

    @Override
    public String loginUser(LoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail()).get();
        if(passwordEncoder.matches(loginDto.getPassword(), user.getPassword())){ // credential 은 비밀번호 부분이라 그냥 없는채로 넣는다
            return jwtTokenProvider.createToken(new UsernamePasswordAuthenticationToken(user.getUserid(),"",user.getAuthority()));
        }else{
            return null;
        }
    }

    @Override
    public UserPageDto browseUser(String nickname) {
        User user = userRepository.findByNickname(nickname).get();
        if(user == null) return null;
        return new UserPageDto().builder()
                                .userId(user.getUserid())
                                .email(user.getEmail())
                                .nickname(user.getNickname())
                                .oneline(user.getOneline())
                                .build();
    }

    @Override
    public MyPageDto mypageUser(String token) throws Exception {
        MyPageDto myPageDto = null;
        if(jwtTokenProvider.vaildateToken(token)) {
            DecodedJWT decodedJWT = JWT.decode(token); //디코딩
            Long userid = Long.parseLong(decodedJWT.getSubject()); //pk 뽑아오기
            User user = userRepository.findByUserid(userid).get();
            myPageDto = new MyPageDto().builder()
                     .userid(user.getUserid())
                     .email(user.getEmail())
                     .phone(user.getPhone())
                     .manner(user.getManner())
                     .name(user.getName())
                     .nickname(user.getNickname())
                     .thumnailroot(user.getThumnailroot())
                     .oneline(user.getOneline())
                     .build();
        }
        return myPageDto;
    }

    @Override
    public void deleteUser(Long userid, String token) throws Exception {
        if(jwtTokenProvider.vaildateToken(token)) {
            User user = userRepository.findByUserid(userid).get();
            userRepository.delete(user);
        }
    }

    @Override
    public void updateUser(Long userid, String token, UpdateDto updateDto) throws Exception { // 프론트에서 변경안해도 기본값 불러주기
        if(jwtTokenProvider.vaildateToken(token)) {
            User user = userRepository.findByUserid(userid).get();
            user.setNickname(updateDto.getNickname());
            user.setOneline(updateDto.getOneline());
            user.setPhone(updateDto.getPhone());
            userRepository.save(user);
        }
    }

    @Override
    public void updateThumbnail(Long userid, MultipartFile multipartFile) throws Exception {
        User user = userRepository.findByUserid(userid).get();
        if(!multipartFile.isEmpty()) { // && !multipartFile.isEmpty()
            //String path = new ClassPathResource("/static").getFile().getAbsolutePath() + "\\thumbnails"; // 로컬 확인용
            String path = "/app";
            String contentType = multipartFile.getContentType();
            File file = new File(path);
            String extension = null;

            if(!file.exists()){
                file.mkdirs();
            }

            if(contentType.contains("jpeg") || contentType.contains("jpg")) extension = ".jpg";
            else if(contentType.contains("png")) extension = ".png";
            else if(contentType.contains("gif")) extension = ".gif";

            path = path + "/" + userid + extension; // 로컬 확인용
            file = new File(path);
            user.setThumnailroot(path);

            multipartFile.transferTo(file);
            userRepository.save(user);
        }
    }

    @Override
    public byte[] getThumbnail(Long userid) throws Exception {
        User user = userRepository.findByUserid(userid).get();
        String path = user.getThumnailroot();
        if(user.getThumnailroot() != null) {
            InputStream imageStream = new FileInputStream(path);
            byte[] imageByteArray = IOUtils.toByteArray(imageStream);
            imageStream.close();
            return imageByteArray;
        }
        return new byte[0];
    }

    @Override 
    public boolean isDuplicatedEmail(String email) { // 이메일 중복체크
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean isDuplicatedNickname(String nickname) { // 닉네임 중복체크
        return userRepository.existsByNickname(nickname);
    }
}
