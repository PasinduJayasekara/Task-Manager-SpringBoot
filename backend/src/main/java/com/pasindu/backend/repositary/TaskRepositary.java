package com.pasindu.backend.repositary;

import com.pasindu.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepositary extends JpaRepository<Task, Long> {

}
