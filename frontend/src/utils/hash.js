/**
 * Simple string hash → stable index picker.
 * Same input always produces the same output, so a project's
 * icon/color stays consistent across renders/sessions without
 * needing to store it in the database.
 */
export function hashStringToIndex(str, arrayLength) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % arrayLength;
}
