export const readInput = async (path: string) => {
  const file = Bun.file(path);

  const text = await file.text();
  return text;
};

export const getInputLineByLine = async (path: string) => {
  const text = await readInput(path);

  return text.split("\n").filter((line: string) => line !== "");
};
