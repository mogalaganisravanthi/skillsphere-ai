
package com.skillsphere.backend.roadmap;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RoadmapService {

    public List<String> generateRoadmap(
            String goal, String level) {

        List<String> roadmap = new ArrayList<>();

        String selectedGoal =
                goal == null ? "" : goal.toLowerCase();

        String selectedLevel =
                level == null ? "beginner" : level.toLowerCase();

        if (selectedGoal.contains("web")) {
            roadmap.add("HTML and CSS fundamentals");
            roadmap.add("JavaScript programming");
            roadmap.add("React fundamentals");
            roadmap.add("REST API integration");
            roadmap.add("Build a full-stack web project");

        } else if (selectedGoal.contains("java")) {
            roadmap.add("Java fundamentals");
            roadmap.add("Object-oriented programming");
            roadmap.add("Collections and exception handling");
            roadmap.add("Spring Boot and REST APIs");
            roadmap.add("Build a Java backend project");

        } else if (selectedGoal.contains("data") ||
                   selectedGoal.contains("ai") ||
                   selectedGoal.contains("machine learning")) {
            roadmap.add("Python fundamentals");
            roadmap.add("NumPy and Pandas");
            roadmap.add("Statistics and data analysis");
            roadmap.add("Machine learning fundamentals");
            roadmap.add("Build an AI project");

        } else {
            roadmap.add("Identify your learning goals");
            roadmap.add("Learn programming fundamentals");
            roadmap.add("Practice problem solving");
            roadmap.add("Build a small project");
            roadmap.add("Create a portfolio project");
        }

        if (selectedLevel.contains("beginner")) {
            roadmap.add(0, "Start with the basics and practice daily");
        } else if (selectedLevel.contains("advanced")) {
            roadmap.add("Study advanced concepts and system design");
        }

        return roadmap;
    }
}
