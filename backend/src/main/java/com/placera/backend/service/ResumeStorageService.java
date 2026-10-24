package com.placera.backend.service;

import com.placera.backend.exception.BadRequestException;
import com.placera.backend.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ResumeStorageService {

    private static final Logger log = LoggerFactory.getLogger(ResumeStorageService.class);
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final byte[] PDF_MAGIC_BYTES = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D}; // "%PDF-"

    private final Path localUploadPath;
    private final String storageType;

    public ResumeStorageService(
            @Value("${placera.storage.local-dir:./uploads/resumes}") String uploadDir,
            @Value("${placera.storage.type:local}") String storageType) {
        this.storageType = storageType;
        this.localUploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.localUploadPath);
        } catch (IOException e) {
            log.error("Could not create local upload directory: {}", this.localUploadPath, e);
        }
    }

    public String storeFile(MultipartFile file) {
        validateFile(file);

        String storageKey = UUID.randomUUID().toString() + ".pdf";

        try {
            Path targetLocation = this.localUploadPath.resolve(storageKey).normalize();
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }
            log.info("Saved resume with storage key: {}", storageKey);
            return storageKey;
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file securely. Please try again.");
        }
    }

    public Resource loadFileAsResource(String storageKey) {
        try {
            Path filePath = this.localUploadPath.resolve(storageKey).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Resume file not found on storage: " + storageKey);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Resume file not found: " + storageKey);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select a valid file to upload");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File exceeds maximum allowed size of 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equalsIgnoreCase("application/pdf")) {
            throw new BadRequestException("Only PDF documents are allowed");
        }

        // Validate file signature (magic bytes) to prevent disguised files
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[PDF_MAGIC_BYTES.length];
            int read = is.read(header);
            if (read < PDF_MAGIC_BYTES.length) {
                throw new BadRequestException("Corrupted or invalid PDF file header");
            }
            for (int i = 0; i < PDF_MAGIC_BYTES.length; i++) {
                if (header[i] != PDF_MAGIC_BYTES[i]) {
                    throw new BadRequestException("File signature verification failed: not a genuine PDF document");
                }
            }
        } catch (IOException e) {
            throw new BadRequestException("Failed to read file content for validation");
        }
    }
}
