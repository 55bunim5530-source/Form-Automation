/** Split evidence for display only. The cited source text itself is unchanged. */
export function evidenceParagraphs(excerpt: string, officialLaw = false): string[] {
  if (!excerpt.trim()) return [];

  const structured = excerpt.replace(/\r\n?/gu, "\n")
    // Some sources place a new legal paragraph on the same line as the previous one.
    .replace(/(?<=[).。:：])\s+(?=[①-⑳](?:\s|[가-힣]))/gu, "\n")
    // PDF extraction can flatten bullets into one long line.
    .replace(/(?<=\S)\s+(?=[□○●•](?:\s|[가-힣]))/gu, "\n")
    .replace(/(?<=[가-힣][.!?])\s+(?=(?:[1-9]\d?|[가-하])\.\s+)/gu, "\n");

  return structured.split(/\n+/u).map((line) => line.trim()).filter(Boolean)
    .flatMap((line) => officialLaw || line.length < 180
      ? [line]
      : line.split(/(?<=[가-힣][.!?])\s+(?=[가-힣])/gu).map((sentence) => sentence.trim()).filter(Boolean));
}
