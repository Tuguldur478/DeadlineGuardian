package com.deadlineguardian.service;

import com.deadlineguardian.model.ChecklistItem;
import com.deadlineguardian.model.Priority;
import com.deadlineguardian.model.Task;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory task store. Replace with a JPA repository for persistence.
 * Seeded with 4 demo tasks on startup so the dashboard is never empty.
 */
@Service
public class TaskService {
    private final Map<String, Task> tasks = new ConcurrentHashMap<>();
    private final AnthropicService anthropic;

    public TaskService(AnthropicService anthropic) {
        this.anthropic = anthropic;
    }

    @PostConstruct
    public void seed() {
        addSeed("Machine Learning Essay", "CS401", LocalDate.now().plusDays(2), 8, 25,
                new String[][]{
                        {"Read assigned papers", "Skim 3 supplied PDFs"},
                        {"Draft outline", "Intro / method / results / discussion"},
                        {"Write first draft", "~1500 words"},
                        {"Add citations", "Use APA 7th edition"},
                        {"Proofread & submit", "Run grammar check"}
                },
                new boolean[]{true, false, false, false, false});

        addSeed("Statistics Problem Set 4", "MATH203", LocalDate.now().plusDays(4), 4, 60,
                new String[][]{
                        {"Review lecture notes", "Focus on confidence intervals"},
                        {"Solve Q1-Q4", "Hypothesis testing"},
                        {"Solve Q5-Q8", "Regression"},
                        {"Type up solutions", "LaTeX format"},
                        {"Submit on ILIAS", ""}
                },
                new boolean[]{true, true, true, false, false});

        addSeed("UX Research Presentation", "DES302", LocalDate.now().plusDays(8), 5, 10,
                new String[][]{
                        {"Pick 3 user personas", "From class research"},
                        {"Build slide deck", "8 slides max"},
                        {"Record demo clip", "60 seconds"},
                        {"Rehearse with team", ""}
                },
                new boolean[]{true, false, false, false});

        addSeed("History Reading Response", "HIST110", LocalDate.now().plusDays(13), 3, 0,
                new String[][]{
                        {"Read chapter 7", ""},
                        {"Annotate key arguments", ""},
                        {"Write 500-word response", ""}
                },
                new boolean[]{false, false, false});

        // re-apply rules so priorities reflect the seeded progress
        tasks.values().forEach(AnthropicService::applyPriorityRules);
    }

    private void addSeed(String title, String course, LocalDate due, int hours,
                         int ignoredProgress, String[][] items, boolean[] done) {
        Task t = new Task();
        t.setTitle(title);
        t.setCourseName(course);
        t.setDueDate(due);
        t.setEstimatedWorkloadHours(hours);
        List<ChecklistItem> list = new ArrayList<>();
        for (int i = 0; i < items.length; i++) {
            list.add(new ChecklistItem(items[i][0], items[i].length > 1 ? items[i][1] : "", done[i]));
        }
        t.setChecklist(list);
        AnthropicService.applyPriorityRules(t);
        tasks.put(t.getId(), t);
    }

    public List<Task> getAll() {
        List<Task> list = new ArrayList<>(tasks.values());
        list.sort(Comparator.comparing(Task::getDueDate, Comparator.nullsLast(Comparator.naturalOrder())));
        return list;
    }

    public Task get(String id) { return tasks.get(id); }

    public Task save(Task t) {
        AnthropicService.applyPriorityRules(t);
        tasks.put(t.getId(), t);
        return t;
    }

    public boolean delete(String id) {
        return tasks.remove(id) != null;
    }

    public Task update(String id, Task incoming) {
        Task existing = tasks.get(id);
        if (existing == null) return null;
        if (incoming.getTitle() != null)            existing.setTitle(incoming.getTitle());
        if (incoming.getCourseName() != null)       existing.setCourseName(incoming.getCourseName());
        if (incoming.getDueDate() != null)          existing.setDueDate(incoming.getDueDate());
        // Only replace the checklist when a non-empty one is actually sent.
        // A metadata-only edit (title, due date, effort) sends no checklist,
        // and Jackson defaults it to an empty list — we must NOT let that wipe
        // the real checklist.
        if (incoming.getChecklist() != null && !incoming.getChecklist().isEmpty())
            existing.setChecklist(incoming.getChecklist());
        if (incoming.getStartRecommendation() != null) existing.setStartRecommendation(incoming.getStartRecommendation());
        if (incoming.getWarningMessage() != null)   existing.setWarningMessage(incoming.getWarningMessage());
        if (incoming.getEstimatedWorkloadHours() > 0) existing.setEstimatedWorkloadHours(incoming.getEstimatedWorkloadHours());
        AnthropicService.applyPriorityRules(existing);
        return existing;
    }

    public List<Task> reanalyzeAll() {
        return anthropic.reanalyzeTasks(getAll());
    }
}
