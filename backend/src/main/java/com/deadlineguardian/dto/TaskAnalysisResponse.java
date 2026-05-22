package com.deadlineguardian.dto;

import com.deadlineguardian.model.Task;
import java.util.List;

public class TaskAnalysisResponse {
    private List<Task> tasks;
    private String summary;

    public TaskAnalysisResponse() {}
    public TaskAnalysisResponse(List<Task> tasks, String summary) {
        this.tasks = tasks;
        this.summary = summary;
    }

    public List<Task> getTasks() { return tasks; }
    public void setTasks(List<Task> tasks) { this.tasks = tasks; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
}
