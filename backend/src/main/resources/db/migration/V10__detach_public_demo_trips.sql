-- Public demo trips should be visible as inspirations, not assigned as private user trips

DELETE FROM trip_user
WHERE trip_id IN (
    SELECT id FROM trips WHERE is_public_demo = TRUE
);
