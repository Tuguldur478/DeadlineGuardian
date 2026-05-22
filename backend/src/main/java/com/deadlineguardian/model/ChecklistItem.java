package com.deadlineguardian.model;

import java.util.UUID;

public class ChecklistItem {
    private String id = UUID.randomUUID().toString();
    private String title;
    private String description;
    private boolean completed;

    public ChecklistItem() {}

    public ChecklistItem(String title, String description, boolean completed) {
        this.title = title;
        this.description = description;
        this.completed = completed;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
