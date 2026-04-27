/**
 * Experience timeline data — one object per entry.
 * Fields you can set per item:
 *   type      — "work" | "project" | "game" (drives the category filter)
 *   status    — "complete" | "draft"  (draft shows a "More details soon" note)
 *   title     — headline
 *   dateLabel — display string for the timeline, e.g. "2022 – 2023" or "Ongoing"
 *   sortKey   — optional "YYYY-MM" for ordering (newer first if larger)
 *   summary   — what you did (short or long; you can add more in this file later)
 *   tags      — strings for the tag filter (case-insensitive match)
 *   preview   — optional image path under /images/ (optional preview on the card)
 *   links     — optional array: { "label", "url", "kind" }
 *                 kind: "play" | "github" | "other"  (affects button styling)
 *
 * To add a new experience: append an object; use status "draft" until filled in.
 */
window.TIMELINE_EXPERIENCES = [
  {
    id: "udub-minecraft",
    type: "work",
    status: "complete",
    title: "UDub Minecraft — Vice-President",
    dateLabel: "2020 – 2022",
    sortKey: "2020-09",
    summary:
      "Led server operations, events, and community for UW Seattle’s Minecraft club (2000+ members) — a welcoming, fair, and creative space for players.",
    tags: ["Leadership", "Project Management", "Community"],
    preview: "images/udub.png",
    links: []
  },
  {
    id: "tech-academy",
    type: "work",
    status: "complete",
    title: "Tech Academy — Instructor / Mentor",
    dateLabel: "Ongoing",
    sortKey: "2019-06",
    summary:
      "Teaching coding, robotics, and 3D modeling to elementary students; mentoring curiosity and problem-solving in STEM.",
    tags: ["Python", "Java", "Robotics", "Teaching", "Mentoring"],
    preview: "images/tech.png",
    links: []
  },
  {
    id: "spring-is-coming",
    type: "project",
    status: "complete",
    title: "Spring is Coming",
    dateLabel: "2023 (course)",
    sortKey: "2023-03",
    summary: "Unity 2D tower defense team project: strategy, pathing, and team coordination.",
    tags: ["Unity", "C#", "Team", "2D", "Course"],
    preview: "images/385Pic.png",
    links: [
      { label: "Play demo", url: "https://snowey1110.github.io/385TeamProject/Final%20Project/", kind: "play" }
    ]
  },
  {
    id: "hero-next-generation",
    type: "game",
    status: "complete",
    title: "Hero Next Generation",
    dateLabel: "2022",
    sortKey: "2022-10",
    summary: "Unity 2D aircraft battle game with boss fight — action feel and level pacing.",
    tags: ["Unity", "C#", "2D", "Boss"],
    preview: "images/hero.png",
    links: [
      { label: "Play / repo", url: "https://github.com/Snowey1110/CSS385/tree/main/Next%20Generation%20Hero", kind: "play" }
    ]
  },
  {
    id: "project-pather",
    type: "game",
    status: "complete",
    title: "Project PathER",
    dateLabel: "2023",
    sortKey: "2023-08",
    summary: "Unity 2D roguelike RPG prototype — systems, exploration, and iteration.",
    tags: ["Unity", "C#", "RPG", "Roguelike"],
    preview: "images/496Pic.png",
    links: [{ label: "GitHub", url: "https://github.com/Snowey1110/ProjectPathER", kind: "github" }]
  },
  {
    id: "traversal",
    type: "project",
    status: "complete",
    title: "Traversal",
    dateLabel: "Team project",
    sortKey: "2021-12",
    summary: "DigiPen C++ team project: 3D parkour speedrun game — performance and feel-first design.",
    tags: ["C++", "3D", "Team", "DigiPen"],
    preview: "images/traversal.png",
    links: [
      {
        label: "Download installer",
        url: "https://drive.google.com/file/d/1_aT4Z8svILOigDedk7etIbKmJJ85XSFH/view?usp=drive_link",
        kind: "other"
      }
    ]
  }
  /* Copy, paste, and edit to add a new row (start as draft, then set status to "complete"):
  ,
  {
    id: "unique-id",
    type: "work", // "work" | "project" | "game"
    status: "draft", // "draft" | "complete"
    title: "Title",
    dateLabel: "2024 – Present",
    sortKey: "2024-01",
    summary: "What you did in this role (add more later).",
    tags: ["TagOne", "TagTwo"],
    preview: "images/your.png", // or omit for no image
    links: [{ label: "GitHub", url: "https://github.com/...", kind: "github" }]
  }
  */
];
