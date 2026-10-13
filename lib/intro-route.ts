import type { FamilySlug } from "./services";

/**
 * Hand-placed routes for the opening animation. Coordinates are maze grid cells
 * (cell = 50 units; centre of cell c is c * 50 + 25). The line starts inside the
 * logo mark, visits every service category, and ends at the maze exit. With
 * `touchWord`, a final horizontal run toward the wordmark is added so the head stops just beside the "P".
 */

export type LabelPos = "above" | "below" | "left" | "right" | "above-left";

export type RouteStep = [number, number] | { at: [number, number]; category: FamilySlug; label: LabelPos };

export type IntroLayout = {
  width: number;
  height: number;
  cols: number;
  rows: number;
  fontSize: number;
  short: boolean;
  mark: { cx: number; cy: number; size: number };
  /** Wordmark box: left edge, vertical centre, height. */
  word: { x: number; cy: number; h: number };
  /** Follow camera eases onto each dot + label and stays inside the maze bounds. */
  frameLabels: boolean;
  /** Finish with a horizontal run so the head arrives level with the wordmark, just short of its "P". */
  touchWord: boolean;
  route: RouteStep[];
};

export const CELL = 50;

/**
 * Which intro plays by default. "follow" = camera follows the line, then pulls
 * back to reveal the whole path; "classic" = the original bird's-eye version.
 * Either can be forced with ?intro=follow or ?intro=classic.
 */
export type IntroVariant = "follow" | "classic";
export const DEFAULT_INTRO: IntroVariant = "follow";

export const desktopLayout: IntroLayout = {
  width: 1600,
  height: 900,
  cols: 32,
  rows: 18,
  fontSize: 18,
  short: false,
  mark: { cx: 800, cy: 450, size: 150 },
  word: { x: 1195, cy: 825, h: 34 },
  frameLabels: false,
  touchWord: false,
  route: [
    [15.5, 8],
    [17, 8],
    [17, 5],
    { at: [22, 5], category: "ai-llm-solutions", label: "above" },
    [27, 5],
    [27, 2],
    { at: [17, 2], category: "custom-software-mobile-apps", label: "above" },
    [13, 2],
    [13, 4],
    [8, 4],
    [8, 2],
    [3, 2],
    { at: [3, 6], category: "web-development-services", label: "right" },
    [3, 9],
    [6, 9],
    [6, 11],
    [6, 13],
    [2, 13],
    [2, 15],
    { at: [4, 15], category: "digital-marketing-seo", label: "below" },
    [9, 15],
    [9, 13],
    [13, 13],
    { at: [13, 15], category: "social-media-paid-advertising", label: "below" },
    [17, 15],
    [17, 12],
    [20, 12],
    [20, 13],
    [20, 16],
    [23, 16],
  ],
};

export const mobileLayout: IntroLayout = {
  width: 900,
  height: 1600,
  cols: 18,
  rows: 32,
  fontSize: 34,
  short: true,
  mark: { cx: 450, cy: 800, size: 220 },
  word: { x: 230, cy: 1525, h: 50 },
  frameLabels: true,
  touchWord: true,
  route: [
    [8.5, 15],
    [11, 15],
    [11, 11],
    { at: [12, 11], category: "ai-llm-solutions", label: "above" },
    [14, 11],
    [14, 7],
    [16, 7],
    [16, 4],
    [11, 4],
    [11, 2],
    { at: [8, 2], category: "custom-software-mobile-apps", label: "above" },
    [6, 2],
    [6, 5],
    [2, 5],
    { at: [2, 8], category: "web-development-services", label: "right" },
    [2, 11],
    [6, 11],
    [6, 14],
    [3, 14],
    { at: [3, 19], category: "digital-marketing-seo", label: "right" },
    [3, 22],
    [8, 22],
    [8, 25],
    [14, 25],
    [14, 21],
    [16, 21],
    { at: [16, 27], category: "social-media-paid-advertising", label: "left" },
    [16, 28],
    [2, 28],
    [2, 30],
  ],
};
