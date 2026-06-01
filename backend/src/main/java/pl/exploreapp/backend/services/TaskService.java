package pl.exploreapp.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.exploreapp.backend.dto.TaskResponse;
import pl.exploreapp.backend.models.Task;
import pl.exploreapp.backend.models.Trip;
import pl.exploreapp.backend.repositories.TaskRepository;
import pl.exploreapp.backend.repositories.TripRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TripRepository tripRepository;

    public TaskService(TaskRepository taskRepository, TripRepository tripRepository) {
        this.taskRepository = taskRepository;
        this.tripRepository = tripRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksForTrip(Long tripId) {
        return taskRepository.findByTripId(tripId).stream()
                .map(task -> new TaskResponse(task.getId(), task.getTitle(), task.isCompleted()))
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse addTask(Long tripId, String title) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        Task task = new Task(title, trip);
        Task savedTask = taskRepository.save(task);

        return new TaskResponse(savedTask.getId(), savedTask.getTitle(), savedTask.isCompleted());
    }

    @Transactional
    public TaskResponse toggleTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setCompleted(!task.isCompleted());
        Task updatedTask = taskRepository.save(task);

        return new TaskResponse(updatedTask.getId(), updatedTask.getTitle(), updatedTask.isCompleted());
    }
}