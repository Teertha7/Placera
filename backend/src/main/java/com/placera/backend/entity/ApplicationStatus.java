package com.placera.backend.entity;

import java.util.Set;

public enum ApplicationStatus {
    APPLIED,
    SHORTLISTED,
    ASSESSMENT,
    TECHNICAL_INTERVIEW,
    HR_INTERVIEW,
    SELECTED,
    REJECTED,
    WITHDRAWN;

    public boolean canTransitionTo(ApplicationStatus nextStatus) {
        if (this == nextStatus) {
            return true;
        }
        return switch (this) {
            case APPLIED -> Set.of(SHORTLISTED, REJECTED, WITHDRAWN).contains(nextStatus);
            case SHORTLISTED -> Set.of(ASSESSMENT, TECHNICAL_INTERVIEW, REJECTED, WITHDRAWN).contains(nextStatus);
            case ASSESSMENT -> Set.of(TECHNICAL_INTERVIEW, HR_INTERVIEW, REJECTED, WITHDRAWN).contains(nextStatus);
            case TECHNICAL_INTERVIEW -> Set.of(HR_INTERVIEW, SELECTED, REJECTED, WITHDRAWN).contains(nextStatus);
            case HR_INTERVIEW -> Set.of(SELECTED, REJECTED, WITHDRAWN).contains(nextStatus);
            case SELECTED, REJECTED, WITHDRAWN -> false; // Terminal states
        };
    }

    public boolean isTerminal() {
        return this == SELECTED || this == REJECTED || this == WITHDRAWN;
    }
}
