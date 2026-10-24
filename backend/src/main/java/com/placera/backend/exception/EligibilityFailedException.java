package com.placera.backend.exception;

import java.util.List;

public class EligibilityFailedException extends RuntimeException {
    private final List<String> reasons;

    public EligibilityFailedException(String message, List<String> reasons) {
        super(message);
        this.reasons = reasons;
    }

    public List<String> getReasons() {
        return reasons;
    }
}
