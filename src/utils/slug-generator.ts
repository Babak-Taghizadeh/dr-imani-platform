export const generateSlug = (input: string): string => {
  return input
    .normalize("NFKD")
    .replace(/[\u200C\u200D]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
};
