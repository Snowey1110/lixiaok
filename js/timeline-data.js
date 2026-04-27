/**
 * Experience timeline — one object per entry.
 *   type        — "work" | "project" | "game" (filter buttons)
 *   status      — "complete" | "draft"  (draft shows a short note)
 *   title       — org or project name
 *   role        — optional job / role line
 *   dateLabel   — human-readable range, e.g. "Apr 2026 – Present"
 *   sortKey     — "YYYY" | "YYYY-MM" | "YYYY-MM-DD" for order (newest / largest first)
 *   summary     — one line overview (kept short)
 *   highlights  — optional: up to 2 short strings (shown as compact bullets; omit to keep card minimal)
 *   tags        — strings for tag filters (and quick-tag clicks)
 *   preview     — optional image path under /images/
 *   links       — optional { label, url, kind }  kind: "play" | "github" | "other"
 *   badge       — optional: override the colored type pill (e.g. "Intern"). Set to "" to hide the pill; omit to use the default for type
 *   topRightLabel — optional short string pinned to the top-right of the card (e.g. employment type)
 *   pinFirst      — optional: if true, this row is listed before all others (chronology still uses sortKey for dates on the card)
 */
window.TIMELINE_EXPERIENCES = [
  {
    id: "visionnav-robotics",
    type: "work",
    status: "complete",
    title: "VisionNav Robotics",
    role: "Project Engineer",
    dateLabel: "Apr 2026 – Present",
    sortKey: "2026-04-26",
    summary:
      "Field deployment and reliability for warehouse AMRs: install, test, and resolve hardware, software, and process issues on site.",
    highlights: [
      "Coordinated install, test, and troubleshooting; aligned engineering, ops, and client teams on logistics sites.",
      "Logged issues, tracked progress, and closed the loop on hardware, software, and workflow problems during rollout."
    ],
    tags: ["Robotic", "Engineering", "SLAM"],
    badge: "",
    topRightLabel: "Full Time",
    pinFirst: true
  },
  {
    id: "infinity-from-marvin",
    type: "work",
    status: "complete",
    title: "Infinity from Marvin",
    role: "Brand Ambassador",
    dateLabel: "Aug 2024 – Apr 2026",
    sortKey: "2026-04-20",
    summary: "In-person product promotion: demos, Q&A, and event presence for brand awareness and feedback to sales and marketing.",
    highlights: [
      "Ran demos and answered product questions in high-traffic event settings.",
      "Collected and relayed customer feedback to support go-to-market decisions."
    ],
    tags: ["Sales", "Marketing"],
    badge: "Part Time"
  },
  {
    id: "kapok-engine",
    type: "game",
    status: "complete",
    title: "Kapok Engine",
    role: "Producer",
    dateLabel: "Sep 2025 – Dec 2025",
    sortKey: "2025-12-20",
    summary: "5-person 3D C++ engine: modular components, 3 shipped prototypes, Lua for rapid gameplay iteration.",
    highlights: [
      "Produced scoping, milestones, and cross-discipline delivery for engine + three playable prototypes.",
      "Primary level design; integrated sol2 to expose the bulk of the engine API to Lua."
    ],
    tags: ["C++", "Lua", "Producing", "3D", "Engine", "DigiPen"]
  },
  {
    id: "siegebreaker-warlords",
    type: "game",
    status: "complete",
    title: "Siegebreaker: Warlords",
    role: "Producer & Game Designer",
    dateLabel: "Jan 2026 – Apr 2026",
    sortKey: "2026-04-30",
    summary:
      "DigiPen Advanced Game Project on the Kapok C++/Lua engine. Wrote all game design documentation for the title; designed and built the full tutorial, three class paths, an endless map mode, and a GUI quest checklist through project wrap in Apr 2026.",
    highlights: [
      "Tutorial: end-to-end onboarding and class-specific beats so new players learn the core loop in-session without extra designer support.",
      "Classes: three distinct class identities with mechanics, content, and flow tuned for readable fantasy in play.",
      "Endless map + GUI checklist: long-run map flow with on-screen objective tracking so goals and next steps stay visible while playing."
    ],
    tags: ["C++", "Lua", "GDD", "Tutorial", "UI", "Producing", "3D", "Engine", "DigiPen", "Game design"]
  },
  {
    id: "hero-next-generation",
    type: "project",
    status: "complete",
    title: "Hero Next Generation",
    role: "Game Designer & Programmer",
    dateLabel: "Jul 2024 – Jun 2025",
    sortKey: "2025-06-28",
    summary: "2D action WebGL: 20+ enemy archetypes, 5-boss run, AI cycles; 93% positive from 200+ playtests — retention +40% after UI pass.",
    highlights: [
      "20+ enemy archetypes and multi-phase bosses with telegraphed attack cycles and difficulty ramp.",
      "Simplified HUD and front-end flow for clearer sessions in post-launch tests."
    ],
    tags: ["Unity", "WebGL", "Boss design", "2D", "C#", "UI"],
    preview: "images/hero.png",
    links: [
      { label: "Play / code", url: "https://github.com/Snowey1110/CSS385/tree/main/Next%20Generation%20Hero", kind: "play" }
    ]
  },
  {
    id: "traversal",
    type: "game",
    status: "complete",
    title: "Traversal",
    role: "Level Designer & Engine Programmer",
    dateLabel: "Jan 2025 – Apr 2025",
    sortKey: "2025-04-30",
    summary: "Custom C++ platformer engine (10+ modules), 15+ hand-built levels, dash, wall-run, and seamless map streaming.",
    highlights: [
      "15+ platforming levels with unique mechanics: dash, wall-run, dynamic load.",
      "Resource management and multi-map pipeline for level-to-level transitions without hitches."
    ],
    tags: ["C++", "Engine", "Level design", "3D", "Platformer", "DigiPen"],
    preview: "images/traversal.png",
    links: [
      {
        label: "Download",
        url: "https://drive.google.com/file/d/1_aT4Z8svILOigDedk7etIbKmJJ85XSFH/view?usp=drive_link",
        kind: "other"
      }
    ]
  },
  {
    id: "project-pather",
    type: "game",
    status: "complete",
    title: "Pather",
    role: "Game Designer & Programmer",
    dateLabel: "May 2024 – Jun 2024",
    sortKey: "2024-06-15",
    summary: "Roguelite demo: documented core loops, class abilities, traits, and waves; 6+ gameplay systems in shipping slice.",
    highlights: [
      "Authored GDD and iteration notes for roguelite combat, waves, and class fantasy.",
      "Class abilities, monsters, attributes, GUI, and a combat + wave flow players could feel end-to-end."
    ],
    tags: ["Unity", "2D", "Roguelite", "Combat", "C#", "Systems"],
    preview: "images/496Pic.png",
    links: [{ label: "GitHub", url: "https://github.com/Snowey1110/ProjectPathER", kind: "github" }]
  },
  {
    id: "tech-academy-intern",
    type: "work",
    status: "complete",
    title: "Tech Academy",
    role: "Teaching Intern",
    dateLabel: "Jun 2023 – Jul 2023",
    sortKey: "2023-07-15",
    summary: "200+ students: code, robotics, 3D modeling; block and Python, simple automation, and class-wide hardware + lab support.",
    highlights: [
      "Delivered structured lessons and hands-on labs; kept kits and 3D tools running in workshop blocks.",
      "Mentored beginners through their first code and small robot builds."
    ],
    tags: ["Python", "Robotics", "3D", "Teaching", "STEM"],
    preview: "images/tech.png",
    badge: "Intern"
  },
  {
    id: "spring-is-coming",
    type: "game",
    status: "complete",
    title: "Spring is Coming",
    role: "Producer · Backend Developer",
    dateLabel: "May 2023 – Jun 2023",
    sortKey: "2023-06-20",
    summary: "4-person, 10-week 2D tower defense in Unity: schedule, 7+ enemy types, 3 auto-tower systems, cheaper enemy AI for web build.",
    highlights: [
      "Produced a fixed schedule and feature cuts so the team shipped a complete TD on time.",
      "Tuned pathing, waves, and AI cost — ~20% lower CPU in browser deployment."
    ],
    tags: ["Unity", "C#", "2D", "Team", "Producing", "Backend"],
    preview: "images/385Pic.png",
    links: [
      { label: "Play", url: "https://snowey1110.github.io/385TeamProject/Final%20Project/", kind: "play" }
    ]
  },
  {
    id: "vaxxinity-intern",
    type: "work",
    status: "complete",
    title: "Vaxxinity",
    role: "Data Science Intern",
    dateLabel: "May 2022 – Jun 2022",
    sortKey: "2022-06-20",
    summary: "Flagged missing or inconsistent research-form fields; escalated edge cases to managers.",
    highlights: [
      "Wrote checks for missing and inconsistent research-form fields; routed edge cases to managers."
    ],
    tags: ["Python", "Data quality", "Validation", "Healthcare data"],
    badge: "Intern"
  },
  {
    id: "subway-sandwich-artist",
    type: "work",
    status: "complete",
    title: "Subway Restaurant",
    role: "Sandwich Artist",
    dateLabel: "Nov 2017 – Jun 2019",
    sortKey: "2019-06-30",
    summary:
      "Part-time front line: customer service, customized orders, and food prep with consistent cleanliness and food-safety standards.",
    highlights: [
      "Served customers quickly with accurate, customized orders and a friendly, professional tone.",
      "Maintained station cleanliness and food safety compliance during busy shifts.",
      "Fielded questions and small service issues so the line kept moving at peak times."
    ],
    tags: ["Customer service", "Food service"],
    badge: "Part Time"
  }
];
/* New entry template — copy into the array above (before `];`):
  {
    id: "unique-id",
    type: "work",
    status: "draft",
    title: "Company or project",
    role: "Optional title",
    dateLabel: "YYYY – YYYY or Present",
    sortKey: "2026-01-01",
    summary: "One or two lines; add highlights and links later.",
    tags: ["Tag1"],
    links: []
  },
*/
