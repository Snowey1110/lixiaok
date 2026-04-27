/**
 * Portfolio timeline — edit this file to add or update experiences.
 * Each field:
 *   type:        "work" | "project" | "game"
 *   title:       string
 *   summary:     what you did (add more later anytime)
 *   dateStart:   "YYYY" or "YYYY-MM" (sorts correctly as string)
 *   dateEnd:     same format, or null = ongoing
 *   draft:       true = show as stub until you add preview/links (optional)
 *   previewImage: path under site root or null for no image
 *   tags:        string[] for filters and display
 *   actions:     optional buttons e.g. { "label", "url", "variant": "play"|"github"|"link" }
 */
window.TIMELINE_EXPERIENCES = [
  {
    id: "udub-minecraft",
    type: "work",
    title: "UDubMinecraft — Vice President",
    summary:
      "Led server operations, managed events, and helped keep a welcoming, fair, and creative community for 2000+ members at UW Seattle.",
    dateStart: "2022-09",
    dateEnd: null,
    draft: false,
    previewImage: "images/udub.png",
    tags: ["Leadership", "Project Management", "Community", "Minecraft"],
    actions: []
  },
  {
    id: "tech-academy",
    type: "work",
    title: "Tech Academy — Instructor",
    summary:
      "Taught coding, robotics, and 3D modeling to elementary students.",
    dateStart: "2021-01",
    dateEnd: "2022-08",
    draft: false,
    previewImage: "images/tech.png",
    tags: ["Teaching", "Python", "Java", "Robotics", "Education"],
    actions: []
  },
  {
    id: "spring-is-coming",
    type: "project",
    title: "Spring is Coming",
    summary: "Unity 2D tower defense team project.",
    dateStart: "2023-10",
    dateEnd: "2023-12",
    draft: false,
    previewImage: "images/385Pic.png",
    tags: ["Unity", "Team", "2D", "Tower Defense"],
    actions: [
      { label: "Play demo", url: "https://snowey1110.github.io/385TeamProject/Final%20Project/", variant: "play" }
    ]
  },
  {
    id: "hero-next-generation",
    type: "game",
    title: "Hero Next Generation",
    summary: "Unity 2D aircraft battle game with boss battle.",
    dateStart: "2023-10",
    dateEnd: "2023-12",
    draft: false,
    previewImage: "images/hero.png",
    tags: ["Unity", "2D", "Action"],
    actions: [
      { label: "Play now", url: "https://github.com/Snowey1110/CSS385/tree/main/Next%20Generation%20Hero", variant: "play" }
    ]
  },
  {
    id: "project-pather",
    type: "game",
    title: "Project PathER",
    summary: "Unity 2D roguelike RPG game prototype.",
    dateStart: "2024-01",
    dateEnd: "2024-03",
    draft: false,
    previewImage: "images/496Pic.png",
    tags: ["Unity", "Roguelike", "RPG", "Prototype"],
    actions: [
      { label: "GitHub", url: "https://github.com/Snowey1110/ProjectPathER", variant: "github" }
    ]
  },
  {
    id: "traversal",
    type: "game",
    title: "Traversal",
    summary: "DigiPen C++ team project: 3D parkour speedrun game.",
    dateStart: "2024-09",
    dateEnd: "2025-05",
    draft: false,
    previewImage: "images/traversal.png",
    tags: ["C++", "3D", "Parkour", "DigiPen", "Team"],
    actions: [
      { label: "Installer", url: "https://drive.google.com/file/d/1_aT4Z8svILOigDedk7etIbKmJJ85XSFH/view?usp=drive_link", variant: "link" }
    ]
  }
];
