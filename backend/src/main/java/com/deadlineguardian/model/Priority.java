package com.deadlineguardian.model;

public enum Priority {
    HIGH, MEDIUM, LOW, COMPLETED;

    public static Priority fromString(String value) {
        if (value == null) return MEDIUM;
        switch (value.trim().toUpperCase()) {
            case "HIGH": return HIGH;
            case "LOW": return LOW;
            case "COMPLETED": return COMPLETED;
            default: return MEDIUM;
        }
    }
}
