package com.deadlineguardian.controller;

import com.deadlineguardian.dto.ChatRequest;
import com.deadlineguardian.dto.ChatResponse;
import com.deadlineguardian.model.Task;
import com.deadlineguardian.service.AnthropicService;
import com.deadlineguardian.service.TaskService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final AnthropicService anthropic;
    private final TaskService taskService;

    public ChatController(AnthropicService anthropic, TaskService taskService) {
        this.anthropic = anthropic;
        this.taskService = taskService;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest req) {
        AnthropicService.ChatResult result = anthropic.chat(req);
        Task saved = null;
        if (result.task != null) {
            saved = taskService.save(result.task);
        }
        return new ChatResponse(result.reply, saved);
    }

    @GetMapping("/status")
    public java.util.Map<String, Object> status() {
        return java.util.Map.of(
                "aiEnabled", anthropic.hasApiKey(),
                "mode", anthropic.hasApiKey() ? "live" : "mock"
        );
    }
}
