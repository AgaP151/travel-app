package pl.exploreapp.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import pl.exploreapp.backend.models.User;
import pl.exploreapp.backend.repositories.UserRepository;
import pl.exploreapp.backend.dto.TaskResponse;
import pl.exploreapp.backend.models.Task;
import pl.exploreapp.backend.models.Trip;
import pl.exploreapp.backend.repositories.TaskRepository;
import pl.exploreapp.backend.repositories.TripRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);
    private final TaskRepository taskRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, TripRepository tripRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }
    private void checkTripAccess(Long tripId) {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();

    User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new AccessDeniedException("User not found"));

    boolean hasAccess = tripRepository.existsByTripIdAndUserId(tripId, currentUser.getId());

    if (!hasAccess && !"ROLE_ADMIN".equals(currentUser.getRole())) {
        throw new AccessDeniedException("You do not have access to this trip");
    }
}

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksForTrip(Long tripId) {
        checkTripAccess(tripId);
        logger.info("Fetching tasks for trip id: {}", tripId);
        return taskRepository.findByTripId(tripId).stream()
                .map(task -> new TaskResponse(task.getId(), task.getTitle(), task.isCompleted()))
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse addTask(Long tripId, String title) {
        checkTripAccess(tripId);
        logger.info("Creating task for trip id: {}", tripId);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        Task task = new Task(title, trip);
        Task savedTask = taskRepository.save(task);

        return new TaskResponse(savedTask.getId(), savedTask.getTitle(), savedTask.isCompleted());
    }

    @Transactional
    public TaskResponse toggleTask(Long tripId, Long taskId) {
        checkTripAccess(tripId);
        logger.info("Toggling task id: {} for trip id: {}", taskId, tripId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setCompleted(!task.isCompleted());
        Task updatedTask = taskRepository.save(task);

        return new TaskResponse(updatedTask.getId(), updatedTask.getTitle(), updatedTask.isCompleted());
    }
}