package com.pasindu.backend.controller;

import com.pasindu.backend.model.Task;
import com.pasindu.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.pasindu.backend.dto.TaskRequestDTO;
import com.pasindu.backend.dto.TaskResponseDTO;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponseDTO> getTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping
    public TaskResponseDTO createTask(
            @Valid @RequestBody TaskRequestDTO task) {

        return taskService.createTask(task);
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id,
                           @Valid @RequestBody Task task) {

        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}