package com.placera.backend.repository;

import com.placera.backend.entity.Job;
import com.placera.backend.entity.JobStatus;
import com.placera.backend.entity.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("SELECT j FROM Job j JOIN FETCH j.company LEFT JOIN FETCH j.eligibilityRule WHERE j.id = :id")
    Optional<Job> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT j FROM Job j JOIN j.company c LEFT JOIN j.eligibilityRule r WHERE " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:activeDeadlineOnly = false OR j.deadline > :now) AND " +
           "(:companyId IS NULL OR c.id = :companyId) AND " +
           "(:query IS NULL OR (LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))))")
    Page<Job> searchJobs(
            @Param("status") JobStatus status,
            @Param("jobType") JobType jobType,
            @Param("location") String location,
            @Param("companyId") Long companyId,
            @Param("activeDeadlineOnly") boolean activeDeadlineOnly,
            @Param("now") Instant now,
            @Param("query") String query,
            Pageable pageable);

    long countByStatus(JobStatus status);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.status = 'PUBLISHED' AND j.deadline > :now")
    long countActivePublishedJobs(@Param("now") Instant now);
}
