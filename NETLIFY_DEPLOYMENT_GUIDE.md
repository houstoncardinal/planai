# Netlify Deployment Guide for Plan.AI

## Error: "supabaseUrl is required"

This error means your environment variables are not configured in Netlify.

## Quick Fix Steps

### 1. Go to Netlify Dashboard
1. Open your Netlify dashboard
2. Select your Plan.AI site
3. Go to **Site settings** → **Environment variables**

### 2. Add Environment Variables

Add these three variables:

#### VITE_SUPABASE_URL
```
Your Supabase project URL
Example: https://xxxxxxxxxxxxx.supabase.co
```

#### VITE_SUPABASE_ANON_KEY
```
Your Supabase anon/public key
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### VITE_OPENAI_API_KEY
```
Your OpenAI API key
Example: sk-proj-...
```

### 3. Find Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`

### 4. Redeploy

After adding environment variables:
1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete
4. Your site should now work!

## Alternative: Use Netlify CLI

If you prefer command line:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Set environment variables
netlify env:set VITE_SUPABASE_URL "your_supabase_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"
netlify env:set VITE_OPENAI_API_KEY "your_openai_key"

# Trigger rebuild
netlify deploy --prod
```

## Verify Environment Variables

After setting variables, verify they're set:
1. Go to **Site settings** → **Environment variables**
2. You should see all three variables listed
3. Click **Deploy** → **Trigger deploy**

## Common Issues

### Issue: Still getting blank screen
**Solution:** Make sure you clicked "Trigger deploy" after adding variables

### Issue: Variables not showing
**Solution:** Make sure you're in the correct site in Netlify dashboard

### Issue: Wrong Supabase URL
**Solution:** URL should be `https://xxxxx.supabase.co` (no trailing slash)

## Build Settings

Make sure your Netlify build settings are:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18 or higher

## Testing Locally

To test with your environment variables:
```bash
# Create .env file (if not exists)
echo "VITE_SUPABASE_URL=your_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_key" >> .env
echo "VITE_OPENAI_API_KEY=your_key" >> .env

# Run locally
npm run dev
```

## Security Note

✅ **NEVER** commit `.env` file to git
✅ **ALWAYS** use environment variables in Netlify
✅ **NEVER** hardcode API keys in your code

## Need Help?

If you're still having issues:
1. Check Netlify deploy logs for errors
2. Verify all three environment variables are set
3. Make sure Supabase project is active
4. Confirm OpenAI API key is valid

---

**Quick Checklist:**
- [ ] Added VITE_SUPABASE_URL to Netlify
- [ ] Added VITE_SUPABASE_ANON_KEY to Netlify
- [ ] Added VITE_OPENAI_API_KEY to Netlify
- [ ] Triggered new deployment
- [ ] Site loads successfully
