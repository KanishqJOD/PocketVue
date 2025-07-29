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

    // Use a direct buffer approach instead of file path
    const parsed = await pdfParse(buffer, {
      max: 0, // Parse all pages
      // Remove the version parameter as it might be causing issues
    });

    return parsed.text || '';
  } catch (error) {
    console.error('PDF parsing error:', error);
    // Provide more specific error message and handle ENOENT errors gracefully
    if (error instanceof Error && error.message.includes('ENOENT')) {
      throw new Error('Failed to parse PDF: The file could not be accessed or does not exist');
    } else {
      throw new Error(
        `Failed to parse PDF: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}