package com.placera.backend.repository;

import com.placera.backend.entity.JobEligibilityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobEligibilityRuleRepository extends JpaRepository<JobEligibilityRule, Long> {
    Optional<JobEligibilityRule> findByJobId(Long jobId);
}
