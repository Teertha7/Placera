package com.placera.backend.service;

import com.placera.backend.dto.*;
import com.placera.backend.entity.Role;
import com.placera.backend.entity.StudentProfile;
import com.placera.backend.entity.User;
import com.placera.backend.exception.BadRequestException;
import com.placera.backend.exception.DuplicateResourceException;
import com.placera.backend.exception.UnauthorizedException;
import com.placera.backend.repository.StudentProfileRepository;
import com.placera.backend.repository.UserRepository;
import com.placera.backend.security.JwtTokenProvider;
import com.placera.backend.security.SecurityUtils;
import com.placera.backend.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AuditService auditService;

    public AuthService(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            AuditService auditService) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.auditService = auditService;
    }

    @Transactional
    public AuthResponse registerStudent(RegisterStudentRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("An account with email " + request.getEmail() + " already exists");
        }

        if (studentProfileRepository.existsByRegistrationNumberIgnoreCase(request.getRegistrationNumber())) {
            throw new DuplicateResourceException("A student with registration number " + request.getRegistrationNumber() + " already exists");
        }

        User user = new User(
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                Role.STUDENT,
                request.getFirstName().trim(),
                request.getLastName().trim(),
                request.getPhoneNumber()
        );
        User savedUser = userRepository.save(user);

        StudentProfile profile = new StudentProfile(
                savedUser,
                request.getRegistrationNumber().trim().toUpperCase(),
                request.getDepartment().trim(),
                request.getDegree().trim(),
                request.getGraduationYear(),
                request.getCgpa(),
                request.getBacklogCount()
        );
        profile.setSkills(request.getSkills());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        studentProfileRepository.save(profile);

        auditService.logEvent(savedUser, "REGISTER", "User", savedUser.getId().toString(), "Student registration completed", null);

        UserPrincipal principal = UserPrincipal.create(savedUser);
        String token = tokenProvider.generateToken(principal);

        return new AuthResponse(token, UserDto.fromEntity(savedUser));
    }

    public AuthResponse login(AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
            );

            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(principal.getId())
                    .orElseThrow(() -> new UnauthorizedException("User not found"));

            if (!user.isActive()) {
                throw new UnauthorizedException("Your account has been deactivated. Please contact the administrator.");
            }

            String token = tokenProvider.generateToken(principal);
            auditService.logEvent(user, "LOGIN", "User", user.getId().toString(), "User logged in successfully", null);

            return new AuthResponse(token, UserDto.fromEntity(user));
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUserDto() {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        return UserDto.fromEntity(user);
    }
}
