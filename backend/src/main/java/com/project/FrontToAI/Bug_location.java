package com.project.FrontToAI;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Bug_location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private int locationId;

    @Column(name = "bug_latitude")
    private double bugLatitude;

    @Column(name = "bug_longitude")
    private double bugLongitude;

    @Column(name = "diagnosed_time")
    private LocalDateTime DiagnosedDate;

    @Column(name = "I_BUG_ID")
    private int BugId;

}