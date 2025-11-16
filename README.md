# VAT Invoice System - Pakistan International School

A cloud-based VAT invoice management application with authentication, data entry, and export capabilities.

## Features

✅ **Authentication System**
- Email verification with Supabase Auth
- Password validation (8+ characters, 1 special character)
- Secure login/logout

✅ **Invoice Management**
- 25 entries per sheet
- Editable VAT rate (default 15%)
- Auto-calculation of VAT amounts and totals
- Real-time calculations

✅ **Cloud Storage**
- Save invoice sheets to Supabase database
- User-specific data isolation
- Persistent storage

✅ **Export Options**
- Excel export (.xlsx format)
- PDF export with school header
- Print-friendly landscape mode

✅ **Professional Layout**
- Header: "PAKISTAN INTERNATIONAL SCHOOL ENGLISH SECTION RIYADH"
- Clean, responsive design
- Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel
- **Libraries**: xlsx, jsPDF, react-hot-toast

## Setup Instructions

### 1. Supabase Setup

Create a new Supabase project and run this SQL:

\`\`\`sql
-- Create invoice_sheets table
CREATE TABLE invoice_sheets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sheet_name TEXT NOT NULL,
  vat_rate DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  entries JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_vat DECIMAL(12,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE invoice_sheets ENABLE ROW LEVEL SECURITY;

-- Create policy for users to access only their own data
CREATE POLICY "Users can view own sheets" ON invoice_sheets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sheets" ON invoice_sheets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sheets" ON invoice_sheets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sheets" ON invoice_sheets
  FOR DELETE USING (auth.uid() = user_id);
\`\`\`

### 2. Environment Variables

Create a \`.env.local\` file:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

\`\`\`bash
vercel
\`\`\`

Add environment variables in Vercel dashboard.

## Usage

1. **Sign Up**: Create account with email and password
2. **Verify Email**: Check inbox for verification link
3. **Login**: Access dashboard with credentials
4. **Enter Data**: Fill in 25 invoice entries
5. **Adjust VAT**: Change VAT rate if needed (default 15%)
6. **Save**: Store data to cloud
7. **Export**: Download as Excel or PDF
8. **Print**: Print in landscape mode

## Password Requirements

- Minimum 8 characters
- At least 1 special character (!@#$%^&*(),.?":{}|<>)

## Support

For issues or questions, contact the development team.

## License

Proprietary - Pakistan International School