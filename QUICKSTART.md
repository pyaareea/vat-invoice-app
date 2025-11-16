# 🚀 Quick Start Guide

Get your VAT Invoice System running in **5 minutes**!

## ⚡ Super Fast Setup

### 1️⃣ Create Supabase Project (2 minutes)

1. Visit: https://supabase.com/dashboard
2. Click **New Project**
3. Fill in:
   - Name: `vat-invoice-system`
   - Database Password: (save this!)
   - Region: Choose closest to Riyadh
4. Click **Create Project** and wait 2 minutes

### 2️⃣ Setup Database (30 seconds)

1. In Supabase, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy ALL content from `supabase-setup.sql` file
4. Paste and click **Run**
5. You should see "Success. No rows returned"

### 3️⃣ Get API Keys (30 seconds)

1. In Supabase, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public** key (long string starting with eyJ...)

### 4️⃣ Deploy to Vercel (2 minutes)

**Click this button to deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/pyaareea/vat-invoice-app)

**OR manually:**

1. Go to: https://vercel.com/new
2. Import: `pyaareea/vat-invoice-app`
3. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = [paste your Project URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [paste your anon key]
   ```
4. Click **Deploy**
5. Wait 2-3 minutes

### 5️⃣ Configure Email (1 minute)

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your Vercel URL (e.g., `https://vat-invoice-app.vercel.app`)
3. Add **Redirect URLs**:
   - `https://your-vercel-url.vercel.app/auth/callback`
4. Click **Save**

## ✅ You're Done!

Visit your Vercel URL and:
1. Click **Sign Up**
2. Create account (password needs 8+ chars, 1 special character like @#$!)
3. Check email for verification link
4. Click link to verify
5. Login and start creating invoices!

## 🎯 Features You Can Use Now

- ✅ Create 25-entry invoice sheets
- ✅ Adjust VAT rate (default 15%)
- ✅ Auto-calculate totals
- ✅ Save to cloud
- ✅ Export to Excel
- ✅ Export to PDF with school header
- ✅ Print in landscape mode

## 🆘 Need Help?

**Email not arriving?**
- Check spam folder
- Wait 2-3 minutes
- Try different email

**Can't login?**
- Make sure you verified email first
- Password must have 8+ characters and 1 special character
- Clear browser cache

**Deployment failed?**
- Check environment variables are correct
- Make sure Supabase project is ready
- Try redeploying

## 📱 Access Your App

Your app URL will be: `https://vat-invoice-app-[random].vercel.app`

Find it in Vercel dashboard after deployment!

---

**🎉 Congratulations!** Your VAT Invoice System is live!