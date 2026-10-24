package com.placera.backend.repository;

import com.placera.backend.entity.Application;
import com.placera.backend.entity.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Optional<Application> findByJobIdAndStudentId(Long jobId, Long studentId);

    boolean existsByJobIdAndStudentId(Long jobId, Long studentId);

    @Query("SELECT a FROM Application a " +
           "JOIN FETCH a.job j " +
           "JOIN FETCH j.company " +
           "WHERE a.student.id = :studentId " +
           "ORDER BY a.createdAt DESC")
    List<Application> findByStudentIdWithJob(@Param("studentId") Long studentId);

    @Query("SELECT a FROM Application a " +
           "JOIN FETCH a.student s " +
           "JOIN FETCH s.user u " +
           "JOIN FETCH a.job j " +
           "JOIN FETCH j.company c " +
           "WHERE (:jobId IS NULL OR j.id = :jobId) AND " +
           "(:companyId IS NULL OR c.id = :companyId) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:department IS NULL OR LOWER(s.department) = LOWER(:department)) AND " +
           "(:query IS NULL OR (LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.registrationNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%'))))")
    Page<Application> searchApplications(
            @Param("jobId") Long jobId,
            @Param("companyId") Long companyId,
            @Param("status") ApplicationStatus status,
            @Param("department") String department,
            @Param("query") String query,
            Pageable pageable);

    long countByStatus(ApplicationStatus status);

    long countByStudentId(Long studentId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.student.id = :studentId AND a.status NOT IN ('REJECTED', 'WITHDRAWN')")
    long countActiveByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.student.id = :studentId AND a.status = 'SELECTED'")
    long countOffersByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(DISTINCT a.student.id) FROM Application a WHERE a.status = 'SELECTED'")
    long countDistinctStudentsWithOffers();

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countApplicationsByStatus();

    @Query("SELECT s.department, COUNT(a) FROM Application a JOIN a.student s GROUP BY s.department")
    List<Object[]> countApplicationsByDepartment();

    @Query("SELECT c.name, COUNT(a) FROM Application a JOIN a.job j JOIN j.company c GROUP BY c.name ORDER BY COUNT(a) DESC")
    List<Object[]> countApplicationsByCompany();

    @Query("SELECT s.department, COUNT(a) FROM Application a JOIN a.student s WHERE a.status = 'SELECTED' GROUP BY s.department")
    List<Object[]> countOffersByDepartment();

    @Query("SELECT s.graduationYear, COUNT(DISTINCT s.id) FROM Application a JOIN a.student s WHERE a.status = 'SELECTED' GROUP BY s.graduationYear")
    List<Object[]> countOffersByGraduationYear();
}
