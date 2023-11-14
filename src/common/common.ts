export function getRandomized(arr: any[], limit?: number) {
  const randomized = arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  return limit ? randomized.filter((el, i) => i < limit) : randomized;
}
