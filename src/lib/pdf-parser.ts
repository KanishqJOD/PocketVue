import { Buffer } from 'buffer';
import path from 'path';

/**
 * Parses a PDF buffer and extracts its text content using pdf-parse.
 * @param buffer - The PDF file buffer
 * @returns The extracted text from the PDF
 */
export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    // Import the core module directly to bypass the debug code in the main index.js
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse/lib/pdf-parse.js');
    
    // Use the core module with our buffer
    const parsed = await pdfParse(buffer, {
      max: 0, // Parse all pages
    });
    
    if (!parsed || !parsed.text) {
      throw new Error('No text content extracted from PDF');
    }
    
    return parsed.text;
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