
package com.skillsphere.backend.roadmap;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @PostMapping("/generate")
    public Map<String, Object> generateRoadmap(
            @RequestBody Map<String, String> request) {

        String goal = request.getOrDefault(
                "goal", "Web Development");

        String level = request.getOrDefault(
                "level", "Beginner");

        List<String> roadmap =
                roadmapService.generateRoadmap(goal, level);

        return Map.of(
                "goal", goal,
                "level", level,
                "roadmap", roadmap
        );
    }
}
