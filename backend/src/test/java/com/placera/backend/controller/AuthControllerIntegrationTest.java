package com.placera.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.placera.backend.dto.AuthRequest;
import com.placera.backend.dto.RegisterStudentRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Should successfully register a new student and return token")
    void testRegisterStudentSuccess() throws Exception {
        RegisterStudentRequest request = new RegisterStudentRequest();
        request.setFirstName("Aarav");
        request.setLastName("Deshmukh");
        request.setEmail("aarav.test@placera.edu");
        request.setPassword("SecurePass#2026!");
        request.setRegistrationNumber("2022BCS9999");
        request.setDepartment("Computer Science");
        request.setDegree("B.Tech");
        request.setGraduationYear(2026);
        request.setCgpa(new BigDecimal("8.75"));
        request.setBacklogCount(0);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value("aarav.test@placera.edu"))
                .andExpect(jsonPath("$.data.user.role").value("STUDENT"));
    }

    @Test
    @DisplayName("Should reject duplicate registration with 409 Conflict")
    void testRegisterDuplicateEmail() throws Exception {
        RegisterStudentRequest request = new RegisterStudentRequest();
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("duplicate.test@placera.edu");
        request.setPassword("SecurePass#2026!");
        request.setRegistrationNumber("2022BCS1111");
        request.setDepartment("Computer Science");
        request.setDegree("B.Tech");
        request.setGraduationYear(2026);
        request.setCgpa(new BigDecimal("8.00"));
        request.setBacklogCount(0);

        // First registration
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Duplicate registration
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("Bootstrap administrator should be able to log in")
    void testAdminLogin() throws Exception {
        AuthRequest loginRequest = new AuthRequest("admin@placera.edu", "AdminPlacera#2026!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.user.role").value("ADMIN"));
    }

    @Test
    @DisplayName("Unauthenticated request to protected endpoint should return 401")
    void testProtectedEndpointWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }
}
