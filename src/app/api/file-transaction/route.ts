import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import * as xlsx from "xlsx";
import { fetchGeminiText } from "@/lib/gemini";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_EXTENSIONS = [".pdf", ".csv", ".xlsx", ".xls"];
export const dynamic = "force-dynamic";

// ---------- Interface ----------
interface ExtractedTransaction {
  date: string;
  description: string;
  amount: number;
  type: "Credit" | "Debit";
  classifiedAs: "Income" | "Expense";
}

// ---------- Gemini Prompt ----------
const CLASSIFICATION_PROMPT = (text: string) => `
You are a personal finance assistant.

Classify each line as a transaction with these fields:
- date
- description
- amount
- type ("Credit" or "Debit")
- classifiedAs ("Income" or "Expense")

If a line doesn't contain a transaction, skip it.
Output a JSON array. Use today's date if no date is present.

TEXT:
"""${text}"""
`.trim();

// ---------- File Parsing ----------
async function extractTextFromFile(file: File, buffer: Buffer): Promise<string> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".pdf")) {
    try {
      console.log("Attempting to parse PDF...");
      
      // Dynamic import with better error handling
      const { parsePdf } = await import("@/lib/pdf-parser");
      
      if (!parsePdf || typeof parsePdf !== 'function') {
        throw new Error("PDF parser function not found or invalid");
      }
      
      const extractedText = await parsePdf(buffer);
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("No text extracted from PDF");
      }
      
      console.log("PDF parsed successfully, extracted text length:", extractedText.length);
      return extractedText;
      
    } catch (pdfError) {
      console.error("PDF parsing error:", pdfError);
      throw new Error(`PDF parsing failed: ${pdfError instanceof Error ? pdfError.message : 'Unknown PDF error'}`);
    }
  }

  if (fileName.endsWith(".csv")) {
    try {
      console.log("Parsing CSV file...");
      const workbook = xlsx.read(buffer, { type: "buffer" });
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("No sheets found in CSV file");
      }
      
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const csvText = xlsx.utils.sheet_to_csv(sheet);
      
      console.log("CSV parsed successfully");
      return csvText;
      
    } catch (csvError) {
      console.error("CSV parsing error:", csvError);
      throw new Error(`CSV parsing failed: ${csvError instanceof Error ? csvError.message : 'Unknown CSV error'}`);
    }
  }

  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    try {
      console.log("Parsing Excel file...");
      const workbook = xlsx.read(buffer, { type: "buffer" });
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("No sheets found in Excel file");
      }
      
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      
      if (!sheet) {
        throw new Error("Could not access first sheet in Excel file");
      }
      
      const csvText = xlsx.utils.sheet_to_csv(sheet);
      
      console.log("Excel parsed successfully");
      return csvText;
      
    } catch (excelError) {
      console.error("Excel parsing error:", excelError);
      throw new Error(`Excel parsing failed: ${excelError instanceof Error ? excelError.message : 'Unknown Excel error'}`);
    }
  }

  throw new Error(`Unsupported file type: ${fileName}`);
}

// ---------- POST Route ----------
export async function POST(req: NextRequest) {
  let tempPath: string | null = null;
  
  try {
    console.log("Processing file upload request...");
    
    const formData = await req.formData();
    const file = formData.get("receipt") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("File received:", file.name, "Size:", file.size);

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const fileExt = path.extname(file.name).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(fileExt)) {
      return NextResponse.json({ 
        error: `Unsupported file type: ${fileExt}. Supported types: ${SUPPORTED_EXTENSIONS.join(', ')}` 
      }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("Buffer created, size:", buffer.length);

    // Create temp file for debugging purposes
    tempPath = path.join(tmpdir(), `${uuidv4()}-${file.name}`);
    await writeFile(tempPath, buffer);
    console.log("Temp file saved:", tempPath);

    // Extract text from file
    let extractedText: string;
    try {
      extractedText = await extractTextFromFile(file, buffer);
      console.log("Text extraction successful, length:", extractedText.length);
    } catch (extractionError) {
      console.error("Text extraction failed:", extractionError);
      return NextResponse.json({
        error: "Failed to extract text from file",
        message: extractionError instanceof Error ? extractionError.message : "Unknown extraction error"
      }, { status: 500 });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({
        error: "No text content found in file"
      }, { status: 400 });
    }

    // Send to Gemini for classification
    let rawResponse: string;
    try {
      console.log("Sending to Gemini for classification...");
      rawResponse = await fetchGeminiText(CLASSIFICATION_PROMPT(extractedText));
      console.log("Gemini response received");
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);
      return NextResponse.json({
        error: "AI classification failed",
        message: geminiError instanceof Error ? geminiError.message : "Unknown AI error"
      }, { status: 500 });
    }

    // Clean and parse the JSON response
    const cleanJson = rawResponse.replace(/```json|```/g, "").trim();
    let transactions: ExtractedTransaction[] = [];

    try {
      const parsed = JSON.parse(cleanJson);
      
      if (!Array.isArray(parsed)) {
        console.warn("Gemini response is not an array:", parsed);
        return NextResponse.json({
          error: "Invalid AI response format",
          message: "Expected array of transactions"
        }, { status: 500 });
      }

      transactions = parsed.filter(
        (t): t is ExtractedTransaction => {
          const isValid = (
            typeof t === 'object' &&
            t !== null &&
            typeof t.date === "string" &&
            typeof t.description === "string" &&
            typeof t.amount === "number" &&
            (t.type === "Credit" || t.type === "Debit") &&
            (t.classifiedAs === "Income" || t.classifiedAs === "Expense")
          );
          
          if (!isValid) {
            console.warn("Invalid transaction object:", t);
          }
          
          return isValid;
        }
      );

      console.log(`Successfully extracted ${transactions.length} valid transactions`);

    } catch (parseError) {
      console.error("Failed to parse Gemini JSON output:", parseError);
      console.error("Raw Gemini response:", rawResponse);
      console.error("Cleaned JSON:", cleanJson);
      
      return NextResponse.json({
        error: "Failed to parse AI response",
        message: "The AI returned invalid JSON format"
      }, { status: 500 });
    }

    return NextResponse.json({ 
      transactions,
      metadata: {
        totalTransactions: transactions.length,
        fileName: file.name,
        fileSize: file.size,
        extractedTextLength: extractedText.length
      }
    });

  } catch (err: unknown) {
    console.error("Unexpected error in POST handler:", err);
    return NextResponse.json(
      {
        error: "Transaction extraction failed",
        message: err instanceof Error ? err.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  } finally {
    // Clean up temp file
    if (tempPath) {
      try {
        await unlink(tempPath);
        console.log("Temp file cleaned up:", tempPath);
      } catch (cleanupError) {
        console.warn("Failed to clean up temp file:", cleanupError);
      }
    }
  }
}