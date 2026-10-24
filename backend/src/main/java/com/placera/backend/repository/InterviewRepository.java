package com.placera.backend.repository;

import com.placera.backend.entity.Interview;
import com.placera.backend.entity.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    @Query("SELECT i FROM Interview i " +
           "JOIN FETCH i.application a " +
           "JOIN FETCH a.job j " +
           "JOIN FETCH j.company " +
           "WHERE a.student.id = :studentId " +
           "ORDER BY i.scheduledTime ASC")
    List<Interview> findByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT i FROM Interview i " +
           "JOIN FETCH i.application a " +
           "JOIN FETCH a.job j " +
           "JOIN FETCH j.company " +
           "WHERE a.student.id = :studentId AND i.scheduledTime >= :now AND i.status = 'SCHEDULED' " +
           "ORDER BY i.scheduledTime ASC")
    List<Interview> findUpcomingByStudentId(@Param("studentId") Long studentId, @Param("now") Instant now);

    @Query("SELECT i FROM Interview i " +
           "JOIN FETCH i.application a " +
           "JOIN FETCH a.student s " +
           "JOIN FETCH s.user " +
           "JOIN FETCH a.job j " +
           "JOIN FETCH j.company " +
           "WHERE i.scheduledTime >= :from AND i.scheduledTime <= :to " +
           "ORDER BY i.scheduledTime ASC")
    List<Interview> findByDateRange(@Param("from") Instant from, @Param("to") Instant to);

    long countByStatus(InterviewStatus status);
}
