package com.pasindu.backend.service;

import com.pasindu.backend.model.Task;
import com.pasindu.backend.repositary.TaskRepositary;
import org.springframework.stereotype.Service;
import com.pasindu.backend.dto.TaskRequestDTO;
import com.pasindu.backend.dto.TaskResponseDTO;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepositary taskRepositary;

    private TaskResponseDTO mapToResponseDTO(Task task) {

        TaskResponseDTO dto = new TaskResponseDTO();

        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setCompleted(task.isCompleted());

        return dto;
    }

    public TaskService(TaskRepositary taskRepositary) {
        this.taskRepositary = taskRepositary;
    }

    public List<TaskResponseDTO> getAllTasks() {

        return taskRepositary.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public TaskResponseDTO createTask(TaskRequestDTO dto) {

        Task task = new Task();

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCompleted(dto.isCompleted());

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
}