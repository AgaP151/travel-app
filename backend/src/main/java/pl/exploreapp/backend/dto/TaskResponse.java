package pl.exploreapp.backend.dto;

public class TaskResponse {
    private Long id;
    private String title;
    private boolean isCompleted;

    public TaskResponse(Long id, String title, boolean isCompleted) {
        this.id = id;
        this.title = title;
        this.isCompleted = isCompleted;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public boolean isCompleted() { return isCompleted; }
}