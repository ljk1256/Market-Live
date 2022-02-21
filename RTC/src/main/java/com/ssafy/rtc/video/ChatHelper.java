package com.ssafy.rtc.video;

import com.google.gson.JsonObject;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

public class ChatHelper {
    private final ConcurrentHashMap<String, UserSession> viewers;
    private final ConcurrentHashMap<String, String> nicknames;  // session-id, nickname
    private UserSession broadCaster;

    public ChatHelper(ConcurrentHashMap<String, UserSession> viewers) {
        this.viewers = viewers;
        this.nicknames = new ConcurrentHashMap<>();
    }

    public void setBroadCaster(UserSession broadCaster) {
        this.broadCaster = broadCaster;
    }

    public void setNickName(String sessionId, String nickname){
        nicknames.put(sessionId, nickname);
    }

    public void enterRoomMessage(String sessionId) throws IOException {
        StringBuffer fullMessage = new StringBuffer();
        fullMessage.append(nicknames.get(sessionId)).append(" 님이 방에 입장하셨습니다.");
        broadCastMessage(fullMessage.toString());
    }

    public void sendMessageHelper(String sessionId, String message, Boolean isBroad) throws IOException {
        StringBuffer fullMessage = new StringBuffer();
        if(isBroad){
            fullMessage.append("[방장]");
        }
        fullMessage.append(nicknames.get(sessionId)).append(": ").append(message);
        broadCastMessage(fullMessage.toString());
    }

    public void exitRoomMessage(String sessionId) throws IOException{
        StringBuffer fullMessage = new StringBuffer();
        fullMessage.append(nicknames.get(sessionId)).append(" 님이 방에서 나갔습니다.");
        broadCastMessage(fullMessage.toString());
        nicknames.remove(sessionId);
    }

    private void broadCastMessage(String message) throws IOException {
        JsonObject response = new JsonObject();
        response.addProperty("id", "message");
        response.addProperty("message", message);

        broadCaster.sendMessage(response);
        for (UserSession session : viewers.values()) {
            session.sendMessage(response);
        }
    }
}
