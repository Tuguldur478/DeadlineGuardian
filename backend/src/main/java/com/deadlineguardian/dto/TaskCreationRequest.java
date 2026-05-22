package com.deadlineguardian.dto;

public class TaskCreationRequest {
    private String courseName;
    private String assignmentTitle;
    private String dueDate;             // ISO date string e.g. "2026-05-22"
    private String teacherInstructions;
    private String classContext;
    private String deliverable;
    private String courseMaterial;      // optional pasted notes /

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getAssignmentTitle() { return assignmentTitle; }
    public void setAssignmentTitle(String assignmentTitle) { this.assignmentTitle = assignmentTitle; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public String getTeacherInstructions() { return teacherInstructions; }
    public void setTeacherInstructions(String teacherInstructions) { this.teacherInstructions = teacherInstructions; }
    public String getClassContext() { return classContext; }
    public void setClassContext(String classContext) { this.classContext = classContext; }
    public String getDeliverable() { return deliverable; }
    public void setDeliverable(String deliverable) { this.deliverable = deliverable; }
    public String getCourseMaterial() { return courseMaterial; }
    public void setCourseMaterial(String courseMaterial) { this.courseMaterial = courseMaterial; }
}
