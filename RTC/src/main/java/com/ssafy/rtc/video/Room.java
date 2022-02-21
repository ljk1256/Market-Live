package com.ssafy.rtc.video;

import com.google.gson.JsonObject;
import com.ssafy.rtc.util.ResponseKeys;
import org.kurento.client.IceCandidate;
import org.kurento.client.MediaPipeline;
import org.kurento.client.WebRtcEndpoint;
import org.kurento.jsonrpc.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

public class Room {
    private final Logger log = LoggerFactory.getLogger(Room.class);

    private MediaPipeline pipeline;
    private final ConcurrentHashMap<String, UserSession> viewers;
    private UserSession broadCaster;
    private final String broadCasterUserId;
    private final ChatHelper chatHelper;

    public Room(String broadCasterUserId, MediaPipeline pipeline) {
        this.viewers = new ConcurrentHashMap<>();
        this.broadCasterUserId = broadCasterUserId;
        this.pipeline = pipeline;
        this.chatHelper = new ChatHelper(viewers);
        log.info("id : {} 의 방이 생성되었습니다", broadCasterUserId);
    }

    public synchronized void initRoom(JsonObject jsonMessage, WebSocketSession session) throws IOException {
        broadCaster = new UserSession(session);
        chatHelper.setBroadCaster(broadCaster);

        broadCaster.setWebRtcEndpoint(new WebRtcEndpoint.Builder(pipeline).build());
        WebRtcEndpoint broadCasterWebRtc = broadCaster.getWebRtcEndpoint();
        addListener(session, broadCasterWebRtc);
        String sdpOffer = jsonMessage.getAsJsonPrimitive("sdpOffer").getAsString();
        String sdpAnswer = broadCasterWebRtc.processOffer(sdpOffer);

        JsonObject response = getJsonObject("presenterResponse", "accepted", null, sdpAnswer, null);
        synchronized (session) {
            broadCaster.sendMessage(response);
        }
        broadCasterWebRtc.gatherCandidates();
        chatHelper.setNickName(session.getId(), jsonMessage.get("nickname").getAsString());
    }

    public synchronized void enterRoom(JsonObject jsonMessage, WebSocketSession session) throws IOException {
        if (broadCaster == null || broadCaster.getWebRtcEndpoint() == null) {
            JsonObject response = getJsonObject("viewerResponse", "rejected", "No active sender now. Become sender or . Try again later ...", null, null);
            session.sendMessage(new TextMessage(response.toString()));
            return;
        }
        UserSession viewer = new UserSession(session);
        viewers.put(session.getId(), viewer);
        WebRtcEndpoint nextWebRtc = new WebRtcEndpoint.Builder(pipeline).build();
        addListener(session, nextWebRtc);
        viewer.setWebRtcEndpoint(nextWebRtc);
        broadCaster.getWebRtcEndpoint().connect(nextWebRtc);
        String sdpOffer = jsonMessage.getAsJsonPrimitive("sdpOffer").getAsString();
        String sdpAnswer = nextWebRtc.processOffer(sdpOffer);

        JsonObject response = getJsonObject("viewerResponse", "accepted", null, sdpAnswer, null);
        synchronized (session) {
            viewer.sendMessage(response);
        }
        chatHelper.setNickName(session.getId(), jsonMessage.get("nickname").getAsString());
        chatHelper.enterRoomMessage(session.getId());
        nextWebRtc.gatherCandidates();
    }

    private void addListener(WebSocketSession session, WebRtcEndpoint nextWebRtc) {
        nextWebRtc.addIceCandidateFoundListener(event -> {
            JsonObject response = new JsonObject();
            response.addProperty("id", "iceCandidate");
            response.add("candidate", JsonUtils.toJsonObject(event.getCandidate()));
            try {
                synchronized (session) {
                    session.sendMessage(new TextMessage(response.toString()));
                }
            } catch (IOException e) {
                log.debug(e.getMessage());
            }
        });
    }

    public void iceCandidate(JsonObject jsonMessage, WebSocketSession session) {
        JsonObject candidate = jsonMessage.get("candidate").getAsJsonObject();
        UserSession user = null;
        if (broadCaster != null) {
            if (broadCaster.getSession() == session) {
                user = broadCaster;
            } else {
                user = viewers.get(session.getId());
            }
        }
        if (user != null) {
            IceCandidate cand =
                    new IceCandidate(candidate.get("candidate").getAsString(), candidate.get("sdpMid")
                            .getAsString(), candidate.get("sdpMLineIndex").getAsInt());
            user.addCandidate(cand);
        }
    }

    public void sendMessage(JsonObject jsonMessage, WebSocketSession session) throws IOException {
        String message = jsonMessage.get("message").getAsString();
        Boolean isBroad;
        if(broadCaster.getSession().getId().equals(session.getId())){
            isBroad = true;
        }else{
            isBroad = false;
        }
        chatHelper.sendMessageHelper(session.getId(), message, isBroad);
    }

    public synchronized String stop(WebSocketSession session) throws IOException {
        String sessionId = session.getId();
        if (broadCaster != null && broadCaster.getSession().getId().equals(sessionId)) {
            for (UserSession viewer : viewers.values()) {
                JsonObject response = getJsonObject("stopCommunication", null, null, null, null);
                viewer.sendMessage(response);
            }
            log.info("Releasing media pipeline");
            if (pipeline != null) {
                pipeline.release();
            }
            pipeline = null;
            broadCaster = null;
            return "broadcaster";
        } else if (viewers.containsKey(sessionId)) {
            if (viewers.get(sessionId).getWebRtcEndpoint() != null) {
                viewers.get(sessionId).getWebRtcEndpoint().release();
            }
            viewers.remove(sessionId);
            chatHelper.exitRoomMessage(sessionId);  //서순
            return "viewer";
        }
        return "error";
    }

    private JsonObject getJsonObject(String id, String response, String message, String sdpAnswer, String candidate) {
        JsonObject result = new JsonObject();
        if (id != null) {
            result.addProperty(ResponseKeys.ID.toString(), id);
        }
        if (response != null) {
            result.addProperty(ResponseKeys.RESPONSE.toString(), response);
        }
        if (message != null) {
            result.addProperty(ResponseKeys.MESSAGE.toString(), message);
        }
        if (sdpAnswer != null) {
            result.addProperty(ResponseKeys.SDPANSWER.toString(), sdpAnswer);
        }
        if (candidate != null) {
            result.addProperty(ResponseKeys.CANDIDATE.toString(), candidate);
        }
        return result;
    }
}
