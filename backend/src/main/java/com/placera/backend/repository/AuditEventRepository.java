package com.placera.backend.repository;

import com.placera.backend.entity.AuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    Page<AuditEvent> findByEntityNameAndEntityIdOrderByCreatedAtDesc(String entityName, String entityId, Pageable pageable);
    List<AuditEvent> findTop50ByOrderByCreatedAtDesc();
}
