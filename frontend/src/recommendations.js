
const learningPaths = {
  Programming: [
    "Java Fundamentals",
    "Data Structures and Algorithms",
    "Object-Oriented Programming",
    "Problem Solving"
  ],
  "Web Development": [
    "HTML and CSS",
    "JavaScript",
    "React",
    "REST API Integration"
  ],
  Database: [
    "SQL Fundamentals",
    "MySQL Queries",
    "Database Design",
    "Spring Data JPA"
  ],
  "AI & Machine Learning": [
    "Python Fundamentals",
    "NumPy and Pandas",
    "Machine Learning Basics",
    "AI Project Development"
  ],
  Communication: [
    "Self Introduction",
    "Public Speaking",
    "Group Discussion",
    "Interview Practice"
  ],
  Other: [
    "Identify Your Goal",
    "Learn the Fundamentals",
    "Practice with Projects",
    "Build a Portfolio"
  ]
};

export function getRecommendations(skills = []) {
  const existingSkills = skills.map((skill) =>
    String(skill.name || "").toLowerCase()
  );

  const categories = skills.map((skill) => skill.category);
  const preferredCategory = categories[0] || "Programming";

  const path =
    learningPaths[preferredCategory] || learningPaths.Programming;

  const recommendations = path
    .filter(
      (topic) =>
        !existingSkills.includes(topic.toLowerCase())
    )
    .slice(0, 4);

  return recommendations.length > 0
    ? recommendations
    : [
        "Build a real-world project",
        "Practice coding problems",
        "Revise your fundamentals",
        "Prepare for interviews"
      ];
}