export const cellKey = (x: number, y: number) => `${x}:${y}`;

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const cn = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

export const formatCount = (value: number) => new Intl.NumberFormat("zh-CN").format(value);
