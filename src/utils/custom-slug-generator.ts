const customSlugGenerator = (input: string): string => {
  return input
    .trim()
    .replace(/[\u200C\u200D]/g, "")
    .replace(/[؟،.?!"':؛؛]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

export default customSlugGenerator;
