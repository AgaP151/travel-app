package pl.exploreapp.backend.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pl.exploreapp.backend.dto.CreateTripRequest;
import pl.exploreapp.backend.models.Trip;
import pl.exploreapp.backend.models.User;
import pl.exploreapp.backend.repositories.TripRepository;
import pl.exploreapp.backend.repositories.UserRepository;
import pl.exploreapp.backend.dto.InviteUserRequest;
import pl.exploreapp.backend.models.Task;
import pl.exploreapp.backend.repositories.TaskRepository;

@Service
public class TripService {

    private static final Logger logger = LoggerFactory.getLogger(TripService.class);

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final MailService mailService;
    private final TaskRepository taskRepository;

    public TripService(
            TripRepository tripRepository,
            UserRepository userRepository,
            MailService mailService,
            TaskRepository taskRepository
    ) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.taskRepository = taskRepository;
    }

    public List<Trip> getAllTrips() {
        User currentUser = getCurrentUser();

        logger.info("Fetching trips for user id: {}", currentUser.getId());

        return tripRepository.findAllByUserId(currentUser.getId());
    }

    @Transactional
    public Trip createTrip(CreateTripRequest request) {
        User currentUser = getCurrentUser();

        Trip trip = new Trip();

        trip.setCategoryId(request.getCategoryId());
        trip.setTitle(request.getTitle());
        trip.setDestination(request.getDestination());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setDescription(request.getDescription());
        trip.setPrice(request.getPrice());
        trip.setArchived(false);

        logger.info("Creating trip with title: {} for user id: {}", request.getTitle(), currentUser.getId());

        Trip savedTrip = tripRepository.save(trip);
        tripRepository.addUserToTrip(savedTrip.getId(), currentUser.getId());

        return savedTrip;
    }

    @Transactional
    public void deleteTrip(Long id) {
        User currentUser = getCurrentUser();

        boolean hasAccess = tripRepository.existsByTripIdAndUserId(id, currentUser.getId());

        if (!hasAccess && !"ROLE_ADMIN".equals(currentUser.getRole())) {
            throw new AccessDeniedException("You do not have access to this trip");
        }

        logger.info("Deleting trip with id: {} by user id: {}", id, currentUser.getId());

        tripRepository.deleteById(id);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
    }
   @Transactional
    public void inviteUserToTrip(Long tripId, InviteUserRequest request) {
        User currentUser = getCurrentUser();

        boolean currentUserHasAccess = tripRepository.existsByTripIdAndUserId(
            tripId,
            currentUser.getId()
    );

    if (!currentUserHasAccess && !"ROLE_ADMIN".equals(currentUser.getRole())) {
        throw new AccessDeniedException("You do not have access to this trip");
    }

    User invitedUser = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("User with this email does not exist"));

    boolean invitedUserAlreadyAdded = tripRepository.existsByTripIdAndUserId(
            tripId,
            invitedUser.getId()
    );

    if (invitedUserAlreadyAdded) {
        return;
    }

    tripRepository.addUserToTrip(tripId, invitedUser.getId());

    Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new IllegalArgumentException("Trip does not exist"));

    mailService.sendTripInviteEmail(
            invitedUser.getEmail(),
            trip.getTitle(),
            currentUser.getEmail()
    );

    logger.info(
            "User {} invited user {} to trip {}",
            currentUser.getEmail(),
            invitedUser.getEmail(),
            tripId
    );
}
    @Transactional
    public void removeUserFromTrip(Long tripId, InviteUserRequest request) {
    User currentUser = getCurrentUser();

    boolean currentUserHasAccess = tripRepository.existsByTripIdAndUserId(
            tripId,
            currentUser.getId()
    );

    if (!currentUserHasAccess && !"ROLE_ADMIN".equals(currentUser.getRole())) {
        throw new AccessDeniedException("You do not have access to this trip");
    }

    User userToRemove = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("User with this email does not exist"));

    tripRepository.removeUserFromTrip(tripId, userToRemove.getId());

    logger.info(
            "User {} removed user {} from trip {}",
            currentUser.getEmail(),
            userToRemove.getEmail(),
            tripId
    );
}
@Transactional
public Trip copyPublicDemoTrip(Long tripId) {
    User currentUser = getCurrentUser();

    Trip sourceTrip = tripRepository.findById(tripId)
            .orElseThrow(() -> new IllegalArgumentException("Trip does not exist"));

    if (!Boolean.TRUE.equals(sourceTrip.getPublicDemo())) {
        throw new IllegalArgumentException("Only public demo trips can be copied");
    }

    Trip copiedTrip = new Trip();
    copiedTrip.setCategoryId(sourceTrip.getCategoryId());
    copiedTrip.setTitle(sourceTrip.getTitle());
    copiedTrip.setDestination(sourceTrip.getDestination());
    copiedTrip.setStartDate(sourceTrip.getStartDate());
    copiedTrip.setEndDate(sourceTrip.getEndDate());
    copiedTrip.setDescription(sourceTrip.getDescription());
    copiedTrip.setPrice(sourceTrip.getPrice());
    copiedTrip.setArchived(false);
    copiedTrip.setPublicDemo(false);

    Trip savedTrip = tripRepository.save(copiedTrip);
    tripRepository.addUserToTrip(savedTrip.getId(), currentUser.getId());

    List<Task> sourceTasks = taskRepository.findByTripId(sourceTrip.getId());

    List<Task> copiedTasks = sourceTasks.stream()
            .map(task -> new Task(task.getTitle(), savedTrip))
            .toList();

    taskRepository.saveAll(copiedTasks);

    logger.info(
            "User {} copied public demo trip {} to private trip {}",
            currentUser.getEmail(),
            sourceTrip.getId(),
            savedTrip.getId()
    );

    return savedTrip;
}
}