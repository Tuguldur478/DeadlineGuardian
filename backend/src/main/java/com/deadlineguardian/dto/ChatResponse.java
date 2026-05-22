package com.deadlineguardian.dto;

import com.deadlineguardian.model.Task;

public class ChatResponse {
    private String reply;
    /** If the AI was able to extract a structured task from the input, it's returned here*/
    private Task extractedTask;

    public ChatResponse() {}
    public ChatResponse(String reply, Task extractedTask) {
        this.reply = reply;
        this.extractedTask = extractedTask;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }
    public Task getExtractedTask() { return extractedTask; }
    public void setExtractedTask(Task extractedTask) { this.extractedTask = extractedTask; }
}
