export function chunkArray<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error("Size must be greater than zero");
  }

  const result: T[][] = [];

  for (let i = 0; i < size; i++) {
    result.push([]);
  }

  let idx = 0;

  for (const item of array) {
    result[idx].push(item);
    idx = (idx + 1) % size;
  }

  return result;
}
