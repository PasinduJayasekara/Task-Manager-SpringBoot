package com.pasindu.backend.service;

import com.pasindu.backend.model.Task;
import com.pasindu.backend.model.User;
import com.pasindu.backend.repositary.TaskRepositary;
import org.springframework.stereotype.Service;
import com.pasindu.backend.dto.TaskRequestDTO;
import com.pasindu.backend.dto.TaskResponseDTO;

import com.pasindu.backend.repositary.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepositary taskRepositary;

    private final UserRepository userRepository;

    private TaskResponseDTO mapToResponseDTO(Task task) {

        TaskResponseDTO dto = new TaskResponseDTO();

        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setCompleted(task.isCompleted());

        return dto;
    }

    public TaskService(
            TaskRepositary taskRepository,
            UserRepository userRepository
    ) {

        this.taskRepositary = taskRepository;
        this.userRepository = userRepository;
    }

    public List<TaskResponseDTO> getAllTasks() {

        return taskRepositary.findByUser(getCurrentUser())
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public TaskResponseDTO createTask(TaskRequestDTO dto) {

        Task task = new Task();

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCompleted(dto.isCompleted());

        task.setUser(getCurrentUser());

        Task savedTask = taskRepositary.save(task);

        return mapToResponseDTO(savedTask);
    }

    public Task getTaskById(Long id) {
        return taskRepositary.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public Task updateTask(Long id, Task updatedTask) {

        Task task = getTaskById(id);

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setCompleted(updatedTask.isCompleted());

        return taskRepositary.save(task);
    }

    public void deleteTask(Long id) {
        taskRepositary.deleteById(id);
    }

    private User getCurrentUser() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}