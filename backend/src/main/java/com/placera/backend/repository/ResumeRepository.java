package com.placera.backend.repository;

import com.placera.backend.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByStudentIdAndActiveTrueOrderByUploadedAtDesc(Long studentId);
    Optional<Resume> findFirstByStudentIdAndActiveTrueOrderByUploadedAtDesc(Long studentId);
    Optional<Resume> findByStorageKey(String storageKey);
}
