/**
 * returns in seconds
 */
export function date_diff(oldD: number | string, newD: number | string) {
  const old = new Date(oldD).getTime();
  const recent = new Date(newD).getTime();

  const seconds = Math.abs(recent - old) / 1000;

  return seconds
}
