package com.placera.backend.repository;

import com.placera.backend.entity.StudentProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUserId(Long userId);

    Optional<StudentProfile> findByRegistrationNumberIgnoreCase(String registrationNumber);

    boolean existsByRegistrationNumberIgnoreCase(String registrationNumber);

    @Query("SELECT sp FROM StudentProfile sp JOIN sp.user u WHERE " +
           "(:department IS NULL OR LOWER(sp.department) = LOWER(:department)) AND " +
           "(:graduationYear IS NULL OR sp.graduationYear = :graduationYear) AND " +
           "(:minCgpa IS NULL OR sp.cgpa >= :minCgpa) AND " +
           "(:query IS NULL OR (" +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(sp.registrationNumber) LIKE LOWER(CONCAT('%', :query, '%'))))")
    Page<StudentProfile> searchStudents(
            @Param("department") String department,
            @Param("graduationYear") Integer graduationYear,
            @Param("minCgpa") BigDecimal minCgpa,
            @Param("query") String query,
            Pageable pageable);
}
