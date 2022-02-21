package com.ssafy.auth.fileupload.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    private final String uploadUrl;

    public FileUploadConfig(@Value("${custom.path.uploadUrl}") String uploadUrl) {
        this.uploadUrl = uploadUrl;
    }

    @Override
    public void addResourceHandlers (ResourceHandlerRegistry resourceHandlerRegistry) {
        resourceHandlerRegistry.addResourceHandler("classpath:static/thumbnails/**")
                .addResourceLocations("file:///" + uploadUrl);
    }

}
