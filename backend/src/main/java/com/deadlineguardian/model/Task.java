package com.deadlineguardian.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Task {
    private String id = UUID.randomUUID().toString();
    private String title;
    private String courseName;
    private LocalDate dueDate;
    private long daysRemaining;
    private Priority priority = Priority.MEDIUM;
    private int estimatedWorkloadHours;
    private String startRecommendation;
    private String warningMessage;
    private List<ChecklistItem> checklist = new ArrayList<>();

    public Task() {}

    public int getProgressPercent() {
        if (checklist == null || checklist.isEmpty()) return 0;
        long done = checklist.stream().filter(ChecklistItem::isCompleted).count();
        return (int) Math.round((done * 100.0) / checklist.size());
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public long getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(long daysRemaining) { this.daysRemaining = daysRemaining; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public int getEstimatedWorkloadHours() { return estimatedWorkloadHours; }
    public void setEstimatedWorkloadHours(int estimatedWorkloadHours) { this.estimatedWorkloadHours = estimatedWorkloadHours; }
    public String getStartRecommendation() { return startRecommendation; }
    public void setStartRecommendation(String startRecommendation) { this.startRecommendation = startRecommendation; }
    public String getWarningMessage() { return warningMessage; }
    public void setWarningMessage(String warningMessage) { this.warningMessage = warningMessage; }
    public List<ChecklistItem> getChecklist() { return checklist; }
    public void setChecklist(List<ChecklistItem> checklist) { this.checklist = checklist; }
}
