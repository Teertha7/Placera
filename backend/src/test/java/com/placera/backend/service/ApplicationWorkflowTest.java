package com.placera.backend.service;

import com.placera.backend.entity.ApplicationStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ApplicationWorkflowTest {

    @Test
    @DisplayName("Valid status transitions should be permitted")
    void testPermittedTransitions() {
        assertTrue(ApplicationStatus.APPLIED.canTransitionTo(ApplicationStatus.SHORTLISTED));
        assertTrue(ApplicationStatus.APPLIED.canTransitionTo(ApplicationStatus.REJECTED));
        assertTrue(ApplicationStatus.APPLIED.canTransitionTo(ApplicationStatus.WITHDRAWN));

        assertTrue(ApplicationStatus.SHORTLISTED.canTransitionTo(ApplicationStatus.TECHNICAL_INTERVIEW));
        assertTrue(ApplicationStatus.SHORTLISTED.canTransitionTo(ApplicationStatus.ASSESSMENT));
        assertTrue(ApplicationStatus.SHORTLISTED.canTransitionTo(ApplicationStatus.REJECTED));

        assertTrue(ApplicationStatus.TECHNICAL_INTERVIEW.canTransitionTo(ApplicationStatus.HR_INTERVIEW));
        assertTrue(ApplicationStatus.TECHNICAL_INTERVIEW.canTransitionTo(ApplicationStatus.SELECTED));
        assertTrue(ApplicationStatus.TECHNICAL_INTERVIEW.canTransitionTo(ApplicationStatus.REJECTED));

        assertTrue(ApplicationStatus.HR_INTERVIEW.canTransitionTo(ApplicationStatus.SELECTED));
        assertTrue(ApplicationStatus.HR_INTERVIEW.canTransitionTo(ApplicationStatus.REJECTED));
    }

    @Test
    @DisplayName("Invalid transitions from terminal states must be blocked")
    void testTerminalStatesCannotTransition() {
        assertTrue(ApplicationStatus.SELECTED.isTerminal());
        assertTrue(ApplicationStatus.REJECTED.isTerminal());
        assertTrue(ApplicationStatus.WITHDRAWN.isTerminal());

        assertFalse(ApplicationStatus.SELECTED.canTransitionTo(ApplicationStatus.APPLIED));
        assertFalse(ApplicationStatus.SELECTED.canTransitionTo(ApplicationStatus.SHORTLISTED));
        assertFalse(ApplicationStatus.SELECTED.canTransitionTo(ApplicationStatus.REJECTED));

        assertFalse(ApplicationStatus.REJECTED.canTransitionTo(ApplicationStatus.SELECTED));
        assertFalse(ApplicationStatus.WITHDRAWN.canTransitionTo(ApplicationStatus.APPLIED));
    }

    @Test
    @DisplayName("Self transition is allowed as an idempotent no-op")
    void testSelfTransition() {
        assertTrue(ApplicationStatus.APPLIED.canTransitionTo(ApplicationStatus.APPLIED));
        assertTrue(ApplicationStatus.SHORTLISTED.canTransitionTo(ApplicationStatus.SHORTLISTED));
    }
}
