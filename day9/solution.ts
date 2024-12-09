import { getInputLineByLine } from "../utils/input";

type DiskSpace = {
  fileId: number | null;
};

type Block = { start: number; end: number };

const getDisk = (input: number[]): [DiskSpace[], Block[], Block[]] => {
  const diskBlocks: Block[] = [];
  const spaceBlocks: Block[] = [];
  const disk: DiskSpace[] = [];
  let fileIndex = 0;
  for (let i = 0; i < input.length; i = i + 2) {
    const fileSize = input[i];
    const diskSpace = input[i + 1];
    const diskBlock = { start: disk.length, end: disk.length };

    for (let index = 0; index < fileSize; index++) {
      disk.push({ fileId: fileIndex });
      diskBlock.end++;
    }

    const spaceBlock = { start: disk.length, end: disk.length };
    for (let index = 0; index < diskSpace; index++) {
      disk.push({ fileId: null });
      spaceBlock.end++;
    }

    fileIndex++;

    diskBlocks.push(diskBlock);
    spaceBlocks.push(spaceBlock);
  }
  return [disk, diskBlocks, spaceBlocks];
};

export const part1 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const input = Array.from(text[0]).map((n) => parseInt(n));
  const [disk] = getDisk(input);

  let i = 0;
  let j = disk.length - 1;
  while (i < j) {
    if (disk[i].fileId !== null) {
      i++;
      continue;
    }
    if (disk[j].fileId === null) {
      j--;
      continue;
    }

    const temp = disk[j];
    disk[j] = { fileId: null };
    disk[i] = temp;
    i++;
    j--;
  }

  return disk.reduce((acc, el, index) => {
    if (el.fileId === null) {
      return acc;
    }
    return acc + el.fileId * index;
  }, 0);
};

export const part2 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const input = Array.from(text[0]).map((n) => parseInt(n));
  const [disk, diskBlocks, spaceBlocks] = getDisk(input);

  let j = diskBlocks.length - 1;
  while (j > 0) {
    for (let i = 0; i < spaceBlocks.length; i++) {
      const diskBlock = diskBlocks[j];
      const spaceBlock = spaceBlocks[i];
      const diskSize = diskBlock.end - diskBlock.start;
      const spaceSize = spaceBlock.end - spaceBlock.start;
      if (diskBlock.start < spaceBlock.start) {
        continue;
      }

      if (spaceSize >= diskSize) {
        let a = diskBlock.start;
        let b = spaceBlock.start;
        while (a < diskBlock.end) {
          const temp = disk[a];
          disk[a] = { fileId: null };
          disk[b] = temp;
          spaceBlocks[i].start++;
          b++;
          a++;
        }
        break;
      }
    }
    j--;
  }

  return disk.reduce((acc, el, index) => {
    if (el.fileId === null) {
      return acc;
    }
    return acc + el.fileId * index;
  }, 0);
};

console.log(await part1());
console.log(await part2());
