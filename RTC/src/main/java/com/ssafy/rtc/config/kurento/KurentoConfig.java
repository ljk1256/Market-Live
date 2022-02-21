package com.ssafy.rtc.config.kurento;

import com.ssafy.rtc.video.RoomManager;
import com.ssafy.rtc.video.RtcHandler;
import org.kurento.client.KurentoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class KurentoConfig implements WebSocketConfigurer {

    @Bean
    public RtcHandler rtcHandler(){
        return new RtcHandler();
    }

    @Bean
    public KurentoClient kurentoClient() {
        return KurentoClient.create();
    }

    @Bean
    public RoomManager roomManager() { return new RoomManager(); }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(rtcHandler(), "/i6c110").setAllowedOrigins("*");
    }

}
