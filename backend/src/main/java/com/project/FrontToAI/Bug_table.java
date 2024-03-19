package com.project.FrontToAI;



import groovyjarjarantlr4.v4.runtime.misc.NotNull;
import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "bug_table")
public class Bug_table{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer I_BUG_ID;

    @NotNull
    private String S_BUG_NAME;

    @Column(columnDefinition = "TEXT")
    private String S_BUG_DETAIL;

    @Column(columnDefinition = "TEXT")
    private String S_HOW_TO_KILL;

    private String S_IMAGE_URL_Egg;

    private String S_IMAGE_URL_Larva;

    private String S_IMAGE_URL_Imago;
    // getters and setters
}