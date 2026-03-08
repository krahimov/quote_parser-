# Hotel Quote Parser

An AI-powered tool for event planners to parse hotel quote emails and extract key financial data. Paste email content (HTML or plain text), or upload files (HTML, PDF) to instantly analyze guestroom costs, meeting room costs, and food & beverage totals.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- **Frontend**: React + [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Vercel AI SDK](https://ai-sdk.dev/) with Google Gemini 3.1 Flash Lite (`@ai-sdk/google`)
- **Database**: PostgreSQL on [Supabase](https://supabase.com/)
- **PDF Parsing**: `pdf-parse` for server-side text extraction
- **HTML Parsing**: `cheerio` for stripping HTML to readable text

## Features

- **Paste or Upload**: Paste raw email content (HTML/plain text) or drag-and-drop HTML/PDF files
- **AI Extraction**: Gemini 3.1 Flash Lite analyzes content and extracts structured financial data
- **4 Key Metrics**: Total Quote, Guestroom Total, Meeting Room Total, Food & Beverage Total
- **Additional Details**: Room rate, room nights, taxes/fees, attrition policy, cancellation policy, concessions
- **Quote History**: All parsed quotes are saved to Supabase and viewable on the History page
- **No Email Integration**: Operates entirely on pasted/uploaded content — no email provider connections

## Setup & Installation

### Prerequisites

- Node.js 18+ installed
- A [Supabase](https://supabase.com/) account with a project created
- A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini)

### 1. Clone the repository

```bash
git clone https://github.com/krahimov/quote_parser-.git
cd quote_parser-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- **Google AI API Key**: Get one from [Google AI Studio](https://aistudio.google.com/apikey)
- **Supabase URL & Anon Key**: Found in your Supabase dashboard under **Settings > API**

### 4. Set up the database

Run the following SQL in your Supabase dashboard (**SQL Editor**):

```sql
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_name TEXT,
  event_name TEXT,
  check_in_date TEXT,
  check_out_date TEXT,
  total_quote TEXT,
  guestroom_total TEXT,
  meeting_room_total TEXT,
  food_beverage_total TEXT,
  additional_details JSONB DEFAULT '{}',
  raw_content TEXT,
  source_type TEXT CHECK (source_type IN ('paste', 'html_upload', 'pdf_upload')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
hotel-quote-parser/
├── app/
│   ├── layout.tsx              # Root layout with fonts and theme
│   ├── page.tsx                # Main page — paste/upload + results
│   ├── globals.css             # Tailwind + custom animations
│   ├── quotes/
│   │   └── page.tsx            # Quote history page
│   └── api/
│       └── parse/
│           └── route.ts        # POST endpoint — parses input via Gemini, saves to Supabase
├── components/
│   ├── Header.tsx              # App header with navigation
│   ├── QuoteInput.tsx          # Paste area + file drag-and-drop upload
│   ├── QuoteResults.tsx        # Extracted data display (4 metric cards + details)
│   └── QuoteHistory.tsx        # List of previously parsed quotes
├── lib/
│   ├── supabase.ts             # Supabase client initialization
│   ├── parse-html.ts           # HTML → text extraction using cheerio
│   ├── parse-pdf.ts            # PDF → text extraction using pdf-parse
│   └── prompt.ts               # System prompt for Gemini
├── supabase/
│   └── schema.sql              # Database schema
├── .env.local.example          # Environment variable template
└── next.config.ts              # Next.js config (pdf-parse as external package)
```

## How It Works

1. **Input**: User pastes hotel quote email content or uploads an HTML/PDF file
2. **Text Extraction**: Server extracts readable text — `cheerio` for HTML, `pdf-parse` for PDFs
3. **AI Analysis**: Text is sent to Gemini 3.1 Flash Lite via the Vercel AI SDK's `generateObject` with a Zod schema for structured output
4. **Storage**: Extracted data is saved to the Supabase `quotes` table
5. **Display**: Results are shown as metric cards with an expandable additional details section
