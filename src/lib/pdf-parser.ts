import { Buffer } from 'buffer';

/**
 * Parses a PDF buffer and extracts its text content using pdf-parse.
 * @param buffer - The PDF file buffer
 * @returns The extracted text from the PDF
 */
export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    // Dynamically import the CommonJS module
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: pdfParse } = await import('pdf-parse');

    const parsed = await pdfParse(buffer, {
      max: 0, // Parse all pages
      version: 'v2.0.550',
    });

    return parsed.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(
      `Failed to parse PDF: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}