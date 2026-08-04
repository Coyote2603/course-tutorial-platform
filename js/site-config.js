/*
 * Course Tutorial Platform
 *
 * Change the values in this file to rebrand the platform. The pages and
 * rendering code read these settings automatically; no build step is needed.
 */

const SITE_CONFIG = Object.freeze({
  siteTitle: "Course Tutorial Platform",
  shortTitle: "Course Tutorials",
  courseTitle: "Designing Better Decisions",
  courseSubtitle: "A reusable set of guided sessions, worked examples, practice activities, and interactive teaching slides.",
  instructorName: "Course Team",
  institutionName: "",
  footerText: "Course Tutorial Platform — an open template for adaptable teaching experiences.",

  theme: Object.freeze({
    primary: "#173f5f",
    accent: "#e05a47",
    accentText: "#b43e30"
  }),

  features: Object.freeze({
    showGame: true
  }),

  game: Object.freeze({
    title: "The Newsvendor Challenge",
    description: "Make inventory decisions under uncertainty, compare your policy with the benchmark, and learn from immediate feedback.",
    href: "newsvendor-game.html",
    duration: "About 6 minutes"
  })
});
