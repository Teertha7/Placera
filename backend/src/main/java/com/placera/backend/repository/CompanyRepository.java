package com.placera.backend.repository;

import com.placera.backend.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Company> findByActiveTrueOrderByNameAsc();

    @Query("SELECT c FROM Company c WHERE " +
           "(:activeOnly IS NULL OR c.active = :activeOnly) AND " +
           "(:query IS NULL OR (LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.industry) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.location) LIKE LOWER(CONCAT('%', :query, '%'))))")
    Page<Company> searchCompanies(@Param("query") String query, @Param("activeOnly") Boolean activeOnly, Pageable pageable);
}
