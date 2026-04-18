import fs from "node:fs/promises";
import path from "node:path";

import { PatternData, PatternSummary } from "@/types/pattern";

const previewHeart =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 9' shape-rendering='crispEdges'><rect width='10' height='9' fill='%23f8f4ec'/><rect x='1' y='0' width='2' height='1' fill='%23dc2828'/><rect x='7' y='0' width='2' height='1' fill='%23dc2828'/><rect x='0' y='1' width='1' height='2' fill='%23dc2828'/><rect x='3' y='1' width='1' height='1' fill='%23dc2828'/><rect x='6' y='1' width='1' height='1' fill='%23dc2828'/><rect x='9' y='1' width='1' height='2' fill='%23dc2828'/><rect x='1' y='1' width='2' height='1' fill='%23ff8cb4'/><rect x='7' y='1' width='2' height='1' fill='%23ff8cb4'/><rect x='1' y='2' width='3' height='1' fill='%23ff8cb4'/><rect x='6' y='2' width='3' height='1' fill='%23ff8cb4'/><rect x='4' y='2' width='2' height='1' fill='%23dc2828'/><rect x='2' y='3' width='6' height='1' fill='%23ff8cb4'/><rect x='1' y='3' width='1' height='1' fill='%23dc2828'/><rect x='8' y='3' width='1' height='1' fill='%23dc2828'/><rect x='2' y='4' width='1' height='1' fill='%23dc2828'/><rect x='3' y='4' width='4' height='1' fill='%23ff8cb4'/><rect x='7' y='4' width='1' height='1' fill='%23dc2828'/><rect x='3' y='5' width='1' height='1' fill='%23dc2828'/><rect x='4' y='5' width='2' height='1' fill='%23ff8cb4'/><rect x='6' y='5' width='1' height='1' fill='%23dc2828'/><rect x='4' y='6' width='2' height='2' fill='%23dc2828'/></svg>";

const previewStar =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 11' shape-rendering='crispEdges'><rect width='11' height='11' fill='%23f8f4ec'/><path d='M4 0h3M3 1h5M2 2h7M1 3h9M0 4h11M1 5h9M2 6h7M3 7h5M4 8h3M5 9h1' stroke='%23fadc46' stroke-width='1'/></svg>";

export const SAMPLE_PATTERN_SUMMARIES: PatternSummary[] = [
  {
    id: "heart",
    title: "像素爱心",
    width: 10,
    height: 9,
    description: "适合先体验颜色高亮和完成标记。",
    previewDataUrl: previewHeart
  },
  {
    id: "star",
    title: "幸运星",
    width: 11,
    height: 11,
    description: "适合测试单色筛选和缩放。",
    previewDataUrl: previewStar
  }
];

export const getPatternPath = (id: string) => path.join(process.cwd(), "public", "patterns", `${id}.json`);

export const loadPatternById = async (id: string) => {
  const content = await fs.readFile(getPatternPath(id), "utf8");
  return JSON.parse(content) as PatternData;
};
