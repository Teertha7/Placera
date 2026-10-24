package com.placera.backend.service;

import com.placera.backend.entity.AuditEvent;
import com.placera.backend.entity.User;
import com.placera.backend.repository.AuditEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);
    private final AuditEventRepository auditEventRepository;

    public AuditService(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logEvent(User user, String action, String entityName, String entityId, String details, String ipAddress) {
        try {
            Long userId = (user != null) ? user.getId() : null;
            AuditEvent event = new AuditEvent(userId, action, entityName, entityId, details, ipAddress);
            auditEventRepository.save(event);
            log.info("Audit: user={} action={} entity={} id={}",
                    (user != null ? user.getEmail() : "system"), action, entityName, entityId);
        } catch (Exception ex) {
            log.error("Failed to persist audit event", ex);
        }
    }
}
