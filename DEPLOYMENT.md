# Deployment Guide

## 🚀 Quick Deployment Steps

### Step 1: Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be ready (2-3 minutes)
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `supabase-setup.sql`
5. Click **Run** to execute the SQL
6. Go to **Settings** → **API** and copy:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Anon/Public Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Step 2: Vercel Deployment

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository: `pyaareea/vat-invoice-app`
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
6. Click **Deploy**
7. Wait 2-3 minutes for deployment to complete

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Add environment variables when prompted
```

### Step 3: Configure Email Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation email if needed
4. Set **Site URL** to your Vercel deployment URL:
   - Go to **Authentication** → **URL Configuration**
   - Add your Vercel URL (e.g., `https://vat-invoice-app.vercel.app`)
5. Add **Redirect URLs**:
   - Add: `https://your-vercel-url.vercel.app/auth/callback`
   - Add: `http://localhost:3000/auth/callback` (for local development)

### Step 4: Test the Application

1. Visit your Vercel deployment URL
2. Click **Sign Up**
3. Enter email and password (8+ chars, 1 special character)
4. Check email for verification link
5. Click verification link
6. Login with credentials
7. Start creating invoices!

## 🔧 Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📝 Post-Deployment Checklist

- [ ] Supabase project created
- [ ] Database tables created (run supabase-setup.sql)
- [ ] Vercel project deployed
- [ ] Environment variables added to Vercel
- [ ] Email provider enabled in Supabase
- [ ] Site URL configured in Supabase
- [ ] Redirect URLs added in Supabase
- [ ] Test signup flow
- [ ] Test email verification
- [ ] Test login
- [ ] Test invoice creation
- [ ] Test Excel export
- [ ] Test PDF export
- [ ] Test print functionality

## 🐛 Troubleshooting

### Email verification not working
- Check Supabase email provider is enabled
- Verify Site URL is set correctly
- Check spam folder for verification email

### Login fails after verification
- Clear browser cache and cookies
- Check redirect URLs are configured
- Verify environment variables are set in Vercel

### Data not saving
- Check Supabase RLS policies are created
- Verify user is authenticated
- Check browser console for errors

### Export not working
- Ensure all dependencies are installed
- Check browser console for errors
- Try different browser

## 🔗 Useful Links

- **GitHub Repository**: https://github.com/pyaareea/vat-invoice-app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard

## 📞 Support

For deployment issues, check:
1. Vercel deployment logs
2. Browser console errors
3. Supabase logs in Dashboard → Logs

## 🎉 Success!

Once deployed, your application will be available at:
`https://vat-invoice-app-[your-vercel-id].vercel.app`

Share this URL with your team to start using the VAT Invoice System!