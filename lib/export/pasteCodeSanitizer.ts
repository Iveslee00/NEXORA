const dataImageUrlPattern = /data:image\/[^"')\s]+/g;

export function stripDataImageUrlsForPaste(input: string) {
  return input.replace(dataImageUrlPattern, '');
}
