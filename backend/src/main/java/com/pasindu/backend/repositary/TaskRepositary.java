package com.pasindu.backend.repositary;

import com.pasindu.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.pasindu.backend.model.User;

public interface TaskRepositary extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
}
