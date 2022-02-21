package com.ssafy.auth.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.ssafy.auth.dto.*;
import com.ssafy.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = "/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup") // 회원가입
    public ResponseEntity<String> signupUser(@RequestBody SignupDto signupDto) {
        try{
            userService.saveUser(signupDto);
        }
        catch (Exception e) {
            return new ResponseEntity<>("회원가입에 실패했습니다.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("회원가입에 성공했습니다.", HttpStatus.CREATED);
    }

    @PostMapping("/signin") // 로그인
    public ResponseEntity<String> signinUser(@RequestBody LoginDto loginDto){
        HttpHeaders responseHttpHeaders = new HttpHeaders();
        responseHttpHeaders.set("Authorization", "Bearer " + userService.loginUser(loginDto));
        if(userService.loginUser(loginDto) == null){
            return new ResponseEntity<>("아이디 또는 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(userService.loginUser(loginDto), responseHttpHeaders, HttpStatus.OK);
    }

    @GetMapping(path = "/checkemail") // 이메일 중복체크
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        try {
            if(userService.isDuplicatedEmail(email)) return new ResponseEntity<>( false, HttpStatus.CONFLICT);
            else return new ResponseEntity<>(true, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(path = "/checknickname") // 닉네임 중복체크
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        try {
            if(userService.isDuplicatedNickname(nickname)) return new ResponseEntity<>( false, HttpStatus.CONFLICT);
            else return new ResponseEntity<>(true, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/search") // 유저찾기
    public ResponseEntity<UserPageDto> searchUser(@RequestParam String nickname) {
        UserPageDto userPageDto = userService.browseUser(nickname);
        if(userPageDto != null) return new ResponseEntity<>(userPageDto, HttpStatus.OK);
        else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/delete") // 회원탈퇴
    public ResponseEntity<String> signoutUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String bearerToken) {
        String token = bearerToken.replace("Bearer ","");//기본적으로 header에 Bearer를 먼저 넣어주고 한다.
        DecodedJWT decodedJWT = JWT.decode(token); //디코딩
        Long userid = Long.parseLong(decodedJWT.getSubject()); //pk 뽑아오기
        try{
            userService.deleteUser(userid, token);
        }
        catch (Exception e) {
            return new ResponseEntity<>("로그인 유효 시간이 지났습니다.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("회원탈퇴 완료.", HttpStatus.OK);
    }

    @PostMapping("/update") // 정보수정
    public ResponseEntity<String> updateUser(@RequestHeader(HttpHeaders.AUTHORIZATION)String bearerToken, @RequestBody UpdateDto updateDto) {
        String token = bearerToken.replace("Bearer ","");//기본적으로 header에 Bearer를 먼저 넣어주고 한다.
        DecodedJWT decodedJWT = JWT.decode(token); //디코딩
        Long userid = Long.parseLong(decodedJWT.getSubject()); //pk 뽑아오기
        try{
            userService.updateUser(userid, token, updateDto);
        }
        catch (Exception e) {
            return new ResponseEntity<>("로그인 유효 시간이 지났습니다.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("회원수정 완료.", HttpStatus.OK);
    }

    @PostMapping("/upload") // 프로필 사진 수정
    public ResponseEntity<String> uploadThumbnail(@RequestParam long userid, @RequestParam MultipartFile multipartFile) {
        try {
            userService.updateThumbnail(userid, multipartFile);
        }
        catch (Exception e) {
            return new ResponseEntity<>("The path could not be found", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("Profile thumbnail update complete", HttpStatus.OK);
    }

    @GetMapping(value = "/thumbnail/{userid}", produces = MediaType.IMAGE_JPEG_VALUE) // 유저 썸네일 요청
    public ResponseEntity<byte []> getProfile(@PathVariable long userid) {
        byte[] result;
        try {
            result = userService.getThumbnail(userid);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/mypage") // 마이페이지
    public ResponseEntity<MyPageDto> mypageUser(@RequestHeader(HttpHeaders.AUTHORIZATION)String bearerToken) {
        String token = bearerToken.replace("Bearer ","");//기본적으로 header에 Bearer를 먼저 넣어주고 한다.
        MyPageDto myPageDto;
        try{
            myPageDto = userService.mypageUser(token);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(myPageDto, HttpStatus.OK);
    }
}
