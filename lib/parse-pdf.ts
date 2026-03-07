// pdf-parse is a CJS module, use dynamic import
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdf = require("pdf-parse");
  const data = await pdf(buffer);
  return data.text.trim();
}
