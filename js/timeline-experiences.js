/**
 * Career & project timeline — one array, easy to extend.
 *
 * Quick add (minimum): set title, type, startDate, summary, tags.
 * Fill in later: preview, links, endDate, expand summary.
 * Optional: draft: true  → shows a “draft” pill until you remove it.
 *
 * type:  "work"   — jobs, teaching, club leadership, internships
 *        "project" — one-off or academic projects, tools, non-game
 *        "game"   — game jams, course games, releases
 *
 * dates: "YYYY" or "YYYY-MM". Use endDate: null for ongoing.
 *
 * Merging: entries in `TIMELINE_EXTRA` (set from the page or
 *   localStorage key `timeline_extra_v1`) are combined for preview in-browser.
 */
/* eslint-disable no-unused-vars */
var TIMELINE_EXPERIENCES = [
  {
    id: "udub-minecraft",
    type: "work",
    title: "Vice President — UDubMinecraft",
    startDate: "2022-09",
    endDate: null,
    summary:
      "Led server operations, events, and community for UW Seattle’s Minecraft club (2000+ members), keeping play fair, welcoming, and creative.",
    preview: { image: "images/udub.png", alt: "UDubMinecraft" },
    tags: ["Leadership", "Minecraft", "Event ops", "Community"]
  },
  {
    id: "spring-is-coming",
    type: "game",
    title: "Spring is Coming",
    startDate: "2023-05",
    endDate: "2023-06",
    summary: "Unity 2D tower defense team project (CSS 385).",
    preview: { image: "images/385Pic.png", alt: "Spring is Coming" },
    playUrl: "https://snowey1110.github.io/385TeamProject/Final%20Project/",
    tags: ["Unity", "2D", "Team project"]
  },
  {
    id: "hero-next-gen",
    type: "game",
    title: "Hero Next Generation",
    startDate: "2022-10",
    endDate: "2022-12",
    summary: "Unity 2D aircraft combat with a boss fight.",
    preview: { image: "images/hero.png", alt: "Hero Next Generation" },
    playUrl:
      "https://github.com/Snowey1110/CSS385/tree/main/Next%20Generation%20Hero",
    playLabel: "Play now!",
    tags: ["Unity", "2D", "Boss design"]
  },
  {
    id: "path-er",
    type: "game",
    title: "Project PathER",
    startDate: "2023-09",
    endDate: "2023-12",
    summary: "Unity 2D roguelike RPG prototype.",
    preview: { image: "images/496Pic.png", alt: "Project PathER" },
    githubUrl: "https://github.com/Snowey1110/ProjectPathER",
    tags: ["Unity", "Roguelike", "RPG"]
  },
  {
    id: "traversal",
    type: "game",
    title: "Traversal",
    startDate: "2021-01",
    endDate: "2021-04",
    summary: "Digipen C++ team project: 3D parkour speedrun game.",
    preview: { image: "images/traversal.png", alt: "Traversal" },
    otherUrl:
      "https://drive.google.com/file/d/1_aT4Z8svILOigDedk7etIbKmJJ85XSFH/view?usp=drive_link",
    otherLabel: "Download",
    tags: ["C++", "3D", "DigiPen", "Speedrun"]
  },
  {
    id: "tech-academy",
    type: "work",
    title: "Tech Academy",
    startDate: "2018-07",
    endDate: "2019-08",
    summary: "Taught coding, robotics, and 3D modeling to elementary students.",
    preview: { image: "images/tech.png", alt: "Tech Academy" },
    tags: ["Python", "Java", "Robotics", "Education"]
  }
];

/** Optional in-memory merge (e.g. tests) — default []. */
var TIMELINE_EXTRA = [];
