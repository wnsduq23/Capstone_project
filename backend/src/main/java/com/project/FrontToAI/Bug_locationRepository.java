package com.project.FrontToAI;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Bug_locationRepository extends JpaRepository<Bug_location, Integer> {

}