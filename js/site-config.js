/*
 * Interactive Teaching Platform
 *
 * Change the values in this file to rebrand the platform. The pages and
 * rendering code read these settings automatically; no build step is needed.
 */

const SITE_CONFIG = Object.freeze({
  siteTitle: "Interactive Teaching Platform",
  shortTitle: "Teaching Platform",
  courseTitle: "An Interactive Teaching Platform",
  courseSubtitle: "A public, reusable version of a platform first built for students, with guided sessions, worked examples, practice activities, interactive slides, and a Newsvendor game.",
  instructorName: "Developed by Stefanos Poulidis",
  institutionName: "",
  footerText: "Built for students and shared for adaptation.",

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
