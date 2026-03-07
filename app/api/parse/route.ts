import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { extractTextFromHtml } from "@/lib/parse-html";
import { extractTextFromPdf } from "@/lib/parse-pdf";
import { SYSTEM_PROMPT } from "@/lib/prompt";

const quoteSchema = z.object({
  hotelName: z.string().nullable().describe("Name of the hotel property"),
  eventName: z.string().nullable().describe("Name of the event or program"),
  checkInDate: z.string().nullable().describe("Check-in / arrival date"),
  checkOutDate: z.string().nullable().describe("Check-out / departure date"),
  totalQuote: z
    .string()
    .nullable()
    .describe(
      "Overall total cost for the entire booking, calculated or extracted"
    ),
  guestroomTotal: z
    .string()
    .nullable()
    .describe("Total cost for all guestrooms"),
  meetingRoomTotal: z
    .string()
    .nullable()
    .describe("Total cost for meeting/conference rooms"),
  foodBeverageTotal: z
    .string()
    .nullable()
    .describe("Total cost for food and beverage"),
  additionalDetails: z
    .object({
      roomRate: z.string().nullable().describe("Rate per room per night"),
      numberOfRooms: z
        .string()
        .nullable()
        .describe("Total number of room nights"),
      taxesAndFees: z
        .string()
        .nullable()
        .describe("Taxes and fees breakdown"),
      attritionPolicy: z.string().nullable().describe("Attrition policy"),
      cancellationPolicy: z
        .string()
        .nullable()
        .describe("Cancellation policy"),
      fbMinimum: z.string().nullable().describe("Food & beverage minimum"),
      concessions: z
        .array(z.string())
        .nullable()
        .describe("List of concessions offered"),
    })
    .nullable(),
});

export type QuoteData = z.infer<typeof quoteSchema>;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let textContent = "";
    let sourceType: "paste" | "html_upload" | "pdf_upload" = "paste";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const pastedContent = formData.get("content") as string | null;

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (file.name.endsWith(".pdf")) {
          textContent = await extractTextFromPdf(buffer);
          sourceType = "pdf_upload";
        } else if (
          file.name.endsWith(".html") ||
          file.name.endsWith(".htm")
        ) {
          const html = buffer.toString("utf-8");
          textContent = extractTextFromHtml(html);
          sourceType = "html_upload";
        } else {
          textContent = buffer.toString("utf-8");
          sourceType = "html_upload";
        }
      } else if (pastedContent) {
        // Check if the pasted content looks like HTML
        if (pastedContent.trim().startsWith("<") || pastedContent.includes("<html")) {
          textContent = extractTextFromHtml(pastedContent);
        } else {
          textContent = pastedContent;
        }
        sourceType = "paste";
      }
    } else {
      const body = await request.json();
      textContent = body.content || "";
      sourceType = "paste";

      if (textContent.trim().startsWith("<") || textContent.includes("<html")) {
        textContent = extractTextFromHtml(textContent);
      }
    }

    if (!textContent.trim()) {
      return Response.json(
        { error: "No content provided to parse" },
        { status: 400 }
      );
    }

    // Truncate if extremely long to stay within token limits
    const maxChars = 30000;
    const truncatedContent =
      textContent.length > maxChars
        ? textContent.slice(0, maxChars) + "\n\n[Content truncated...]"
        : textContent;

    const { object } = await generateObject({
      model: google("gemini-3.1-flash-lite-preview"),
      schema: quoteSchema,
      system: SYSTEM_PROMPT,
      prompt: `Parse the following hotel quote email and extract all financial data:\n\n${truncatedContent}`,
    });

    // Save to Supabase
    const supabase = getSupabase();
    if (supabase) {
      const { data: savedQuote, error: dbError } = await supabase
        .from("quotes")
        .insert({
          hotel_name: object.hotelName,
          event_name: object.eventName,
          check_in_date: object.checkInDate,
          check_out_date: object.checkOutDate,
          total_quote: object.totalQuote,
          guestroom_total: object.guestroomTotal,
          meeting_room_total: object.meetingRoomTotal,
          food_beverage_total: object.foodBeverageTotal,
          additional_details: object.additionalDetails,
          raw_content: textContent.slice(0, 10000),
          source_type: sourceType,
        })
        .select()
        .single();

      if (dbError) {
        console.error("Supabase error:", dbError);
        return Response.json({ data: object, saved: false });
      }

      return Response.json({ data: object, saved: true, id: savedQuote?.id });
    }

    return Response.json({ data: object, saved: false });
  } catch (error) {
    console.error("Parse error:", error);
    return Response.json(
      { error: "Failed to parse quote. Please try again." },
      { status: 500 }
    );
  }
}
