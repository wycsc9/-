import { BeadColor } from "@/types/pattern";

export const EMPTY_BEAD_COLOR: BeadColor = {
  id: "empty",
  code: "C00",
  name: "空白",
  rgb: [248, 244, 236]
};

export const DEFAULT_BEAD_PALETTE: BeadColor[] = [
  EMPTY_BEAD_COLOR,
  { id: "black", code: "C01", name: "黑色", rgb: [30, 30, 30] },
  { id: "white", code: "C02", name: "白色", rgb: [245, 245, 245] },
  { id: "red", code: "C03", name: "红色", rgb: [220, 40, 40] },
  { id: "pink", code: "C04", name: "粉色", rgb: [255, 140, 180] },
  { id: "orange", code: "C05", name: "橙色", rgb: [245, 140, 40] },
  { id: "yellow", code: "C06", name: "黄色", rgb: [250, 220, 70] },
  { id: "light-green", code: "C07", name: "浅绿色", rgb: [150, 210, 90] },
  { id: "green", code: "C08", name: "绿色", rgb: [70, 160, 70] },
  { id: "light-blue", code: "C09", name: "浅蓝色", rgb: [120, 190, 255] },
  { id: "blue", code: "C10", name: "蓝色", rgb: [60, 110, 220] },
  { id: "purple", code: "C11", name: "紫色", rgb: [130, 80, 190] },
  { id: "brown", code: "C12", name: "棕色", rgb: [120, 75, 45] },
  { id: "gray", code: "C13", name: "灰色", rgb: [140, 140, 140] },
  { id: "dark-gray", code: "C14", name: "深灰色", rgb: [90, 90, 90] },
  { id: "cream", code: "C15", name: "米色", rgb: [250, 235, 200] },
  { id: "skin-tone-light", code: "C16", name: "浅肤色", rgb: [236, 194, 154] },
  { id: "skin-tone-medium", code: "C17", name: "中肤色", rgb: [198, 142, 102] },
  { id: "skin-tone-dark", code: "C18", name: "深肤色", rgb: [124, 84, 54] },
  { id: "teal", code: "C19", name: "青色", rgb: [43, 152, 160] },
  { id: "magenta", code: "C20", name: "洋红色", rgb: [206, 52, 149] },
  { id: "navy", code: "C21", name: "藏蓝色", rgb: [43, 61, 114] },
  { id: "mint", code: "C22", name: "薄荷绿", rgb: [166, 236, 204] },
  { id: "gold", code: "C23", name: "金色", rgb: [216, 165, 42] }
];

export const DEFAULT_BEAD_PALETTE_WITHOUT_EMPTY = DEFAULT_BEAD_PALETTE.filter((color) => color.id !== "empty");
