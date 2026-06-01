package pl.exploreapp.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.exploreapp.backend.dto.TaskResponse;
import pl.exploreapp.backend.services.TaskService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/{tripId}/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(@PathVariable Long tripId) {
        return ResponseEntity.ok(taskService.getTasksForTrip(tripId));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> addTask(
            @PathVariable Long tripId,
            @RequestBody Map<String, String> request) {
        String title = request.get("title");
        if (title == null || title.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(taskService.addTask(tripId, title));
    }

    @PatchMapping("/{taskId}/toggle")
    public ResponseEntity<TaskResponse> toggleTask(
            @PathVariable Long tripId,
            @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.toggleTask(taskId));
    }
}