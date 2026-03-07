import * as cheerio from "cheerio";

export function extractTextFromHtml(html: string): string {
  const $ = cheerio.load(html);

  // Remove script, style, and head tags
  $("script, style, head, noscript").remove();

  // Get text content, preserving some structure
  const text = $("body").text();

  // Clean up whitespace: collapse multiple spaces/newlines
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}
