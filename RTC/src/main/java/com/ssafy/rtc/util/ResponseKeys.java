package com.ssafy.rtc.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResponseKeys {
    ID("id"),
    ROOMID("roomid"),
    USERID("userid"),
    RESPONSE("response"),
    MESSAGE("message"),
    SDPANSWER("sdpAnswer"),
    CANDIDATE("candidate");

    private final String value;

    @Override
    public String toString(){
        return value;
    }
}
