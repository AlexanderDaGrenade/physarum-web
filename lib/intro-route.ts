/**
 * Hand-placed routes for the opening animation. Coordinates are maze grid cells
 * (cell = 50 units; centre of cell c is c * 50 + 25). The line starts inside the
 * logo mark, visits every service, and ends at the maze exit beside the wordmark.
 */

export type LabelPos = "above" | "below" | "left" | "right" | "above-left";

export type RouteStep = [number, number] | { at: [number, number]; service: string; label: LabelPos };

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
  route: RouteStep[];
};

export const CELL = 50;

/** sessionStorage key: set once the intro has played this session. */
export const INTRO_KEY = "physarum-intro";

export const desktopLayout: IntroLayout = {
  width: 1600,
  height: 900,
  cols: 32,
  rows: 18,
  fontSize: 18,
  short: false,
  mark: { cx: 800, cy: 450, size: 150 },
  word: { x: 1195, cy: 825, h: 34 },
  route: [
    [15.5, 8],
    [17, 8],
    [17, 5],
    { at: [22, 5], service: "llm-training-data", label: "above" },
    [27, 5],
    { at: [27, 2], service: "llm-benchmarking", label: "right" },
    { at: [17, 2], service: "evals", label: "above" },
    [13, 2],
    [13, 4],
    [8, 4],
    { at: [8, 2], service: "ai-automation", label: "above" },
    [3, 2],
    { at: [3, 6], service: "web-apps", label: "right" },
    [3, 9],
    [6, 9],
    { at: [6, 11], service: "ai-web-apps", label: "right" },
    [6, 13],
    [2, 13],
    [2, 15],
    { at: [4, 15], service: "mobile-apps", label: "below" },
    [9, 15],
    [9, 13],
    [13, 13],
    { at: [13, 15], service: "digital-marketing-seo", label: "below" },
    [17, 15],
    [17, 12],
    [20, 12],
    { at: [20, 13], service: "social-media-meta-ads", label: "right" },
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
  word: { x: 150, cy: 1525, h: 50 },
  route: [
    [8.5, 15],
    [11, 15],
    [11, 11],
    { at: [14, 11], service: "llm-training-data", label: "above-left" },
    [14, 7],
    [16, 7],
    { at: [16, 4], service: "llm-benchmarking", label: "above-left" },
    [11, 4],
    [11, 2],
    { at: [6, 2], service: "evals", label: "above" },
    [6, 5],
    [2, 5],
    { at: [2, 8], service: "ai-automation", label: "right" },
    [2, 11],
    { at: [6, 11], service: "web-apps", label: "above" },
    [6, 14],
    [3, 14],
    { at: [3, 19], service: "ai-web-apps", label: "right" },
    [3, 22],
    { at: [8, 22], service: "mobile-apps", label: "above" },
    [8, 25],
    [14, 25],
    { at: [14, 21], service: "digital-marketing-seo", label: "above" },
    [16, 21],
    { at: [16, 28], service: "social-media-meta-ads", label: "above-left" },
    [2, 28],
    [2, 30],
  ],
};
