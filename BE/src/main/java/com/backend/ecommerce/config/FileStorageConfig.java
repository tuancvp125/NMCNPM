package com.backend.ecommerce.config;

import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig {

    public static final Path UPLOAD_DIR = Paths.get(System.getProperty("user.dir"), "uploads", "chat");

    public static Path getUploadPath() {
        return UPLOAD_DIR;
    }
}
