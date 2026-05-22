package com.deadlineguardian.controller;

import com.deadlineguardian.dto.TaskAnalysisResponse;
import com.deadlineguardian.dto.TaskCreationRequest;
import com.deadlineguardian.model.Task;
import com.deadlineguardian.service.AnthropicService;
import com.deadlineguardian.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final AnthropicService anthropic;

    public TaskController(TaskService taskService, AnthropicService anthropic) {
        this.taskService = taskService;
        this.anthropic = anthropic;
    }

    @GetMapping
    public List<Task> all() { return taskService.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Task> one(@PathVariable String id) {
        Task t = taskService.get(id);
        return t == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(t);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable String id, @RequestBody Task incoming) {
        Task updated = taskService.update(id, incoming);
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        boolean removed = taskService.delete(id);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    /** Takes messy student input, sends it to Claude, returns an official Task. */
    @PostMapping("/create-from-ai")
    public Task createFromAi(@RequestBody TaskCreationRequest req) {
        Task t = anthropic.createTaskFromInput(req);
        return taskService.save(t);
    }

    /** Re-analyzes the entire workload: reorders by priority + due date and refreshes warnings. */
    @PostMapping("/reanalyze")
    public TaskAnalysisResponse reanalyze() {
        List<Task> tasks = taskService.reanalyzeAll();
        long high = tasks.stream().filter(t -> t.getPriority() == com.deadlineguardian.model.Priority.HIGH).count();
        String summary = high == 0
                ? "All clear — no high-priority items right now."
                : high + " high-priority task" + (high == 1 ? "" : "s") + " need" + (high == 1 ? "s" : "") + " your attention.";
        return new TaskAnalysisResponse(tasks, summary);
    }
}
