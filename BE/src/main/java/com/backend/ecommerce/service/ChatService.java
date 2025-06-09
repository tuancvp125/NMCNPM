package com.backend.ecommerce.service;

import com.backend.ecommerce.dto.Request.ChatMessageRequest;
import com.backend.ecommerce.model.ChatMessage;
import com.backend.ecommerce.model.ChatTicket;
import com.backend.ecommerce.repository.ChatMessageRepository;
import com.backend.ecommerce.repository.ChatTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import static com.backend.ecommerce.config.FileStorageConfig.getUploadPath;


@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatTicketRepository ticketRepo;
    private final ChatMessageRepository messageRepo;

    // Lấy hoặc tạo ticket chat theo userEmail + productId
    public ChatTicket getOrCreateTicket(String userEmail, String productId) {
        return ticketRepo.findByUserEmailAndProductId(userEmail, productId)
                .orElseGet(() -> {
                    ChatTicket newTicket = ChatTicket.builder()
                            .userEmail(userEmail)
                            .productId(productId)
                            .status("open")
                            .build();
                    return ticketRepo.save(newTicket);
                });
    }

    // Lưu tin nhắn text
    public ChatMessage saveTextMessage(ChatMessageRequest request) {
        ChatTicket ticket = getOrCreateTicket(request.getUserEmail(), request.getProductId());

        ChatMessage message = ChatMessage.builder()
                .ticket(ticket)
                .senderEmail(request.getIsFromAdmin() ? "admin" : request.getUserEmail())
                .content(request.getContent())
                .isFromAdmin(request.getIsFromAdmin())
                .isFile(false) // đánh dấu đây là text message
                .build();

        return messageRepo.save(message);
    }

    // Lưu tin nhắn dạng file upload MultipartFile
    public ChatMessage saveFileMessage(String userEmail, String productId, MultipartFile file, Boolean isFromAdmin) throws IOException {
        ChatTicket ticket = getOrCreateTicket(userEmail, productId);

        // Tạo thư mục nếu chưa tồn tại
        Path uploadPath = getUploadPath();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Tạo tên file duy nhất
        String filename = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path filePath = uploadPath.resolve(filename);

        // Lưu file vào hệ thống
        file.transferTo(filePath.toFile());

        // Trả lại đường dẫn để FE có thể truy cập
        String fileUrl = "/uploads/chat/" + filename;

        ChatMessage message = ChatMessage.builder()
                .ticket(ticket)
                .senderEmail(isFromAdmin ? "admin" : userEmail)
                .content(fileUrl)
                .isFromAdmin(isFromAdmin)
                .isFile(true)
                .build();

        return messageRepo.save(message);
    }

    // Lấy danh sách tin nhắn theo ticket (userEmail + productId)
    public List<ChatMessage> getMessages(String userEmail, String productId) {
        Optional<ChatTicket> ticketOpt = ticketRepo.findByUserEmailAndProductId(userEmail, productId);
        return ticketOpt.map(ticket -> messageRepo.findByTicketOrderByTimestampAsc(ticket)).orElse(List.of());
    }
}
