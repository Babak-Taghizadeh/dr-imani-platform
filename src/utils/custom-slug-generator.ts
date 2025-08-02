const stripHtmlTags = (html: string): string => {
  const withoutTags = html.replace(/<[^>]*>/g, "");

  const textarea = document.createElement("textarea");
  textarea.innerHTML = withoutTags;
  const decoded = textarea.value;

  return decoded.replace(/\s+/g, " ").replace(/\n+/g, " ").trim();
};

const stripHtmlTagsServer = (html: string): string => {
  const withoutTags = html.replace(/<[^>]*>/g, "");

  const decoded = withoutTags
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "...");

  return decoded.replace(/\s+/g, " ").replace(/\n+/g, " ").trim();
};

export const generateSlug = (input: string): string => {
  return input
    .trim()
    .replace(/[\u200C\u200D]/g, "")
    .replace(/[؟،.?!"':؛؛]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

export const generateExcerpt = (
  htmlContent: string,
  maxLength: number = 150,
): string => {
  const plainText =
    typeof document !== "undefined"
      ? stripHtmlTags(htmlContent)
      : stripHtmlTagsServer(htmlContent);

  if (plainText.length <= maxLength) return plainText;

  const truncated = plainText.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf("."),
    truncated.lastIndexOf("!"),
    truncated.lastIndexOf("?"),
  );

  if (lastSentenceEnd > maxLength * 0.6) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }

  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
};
