# 🚀 Deployment Guide - ACME Electricity Billing System

## 📋 Overview

This guide will help you deploy:
- **Frontend**: Vercel (React + TypeScript + Vite)
- **Backend**: Railway (NestJS + TypeORM + PostgreSQL)
- **Database**: Neon PostgreSQL (Already configured ✅)

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:

- [x] GitHub repository created and code pushed
- [x] Neon PostgreSQL database created and tested
- [x] Admin account created (`admin/password123`)
- [x] Backend health check working (`/health` endpoint)
- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Railway account (free $5 credit)

---

## 🎯 Deployment Steps

### **Step 1: Push Code to GitHub** 📤

```bash
# Navigate to project root
cd K:\ACME_AI

# Check git status
git status

# Add all files
git add .

# Commit changes
git commit -m "Ready for deployment - Production configuration"

# Push to GitHub
git push -u origin main
```

**If you haven't committed yet:**
```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git branch -M main
git remote add origin https://github.com/Ranger-DRAX/Admin-Driven-Rule-Engine-Utility-Bill-Calculator-.git
git push -u origin main
```

---

### **Step 2: Deploy Backend to Railway** 🚂

#### 2.1. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your repositories

#### 2.2. Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: `Admin-Driven-Rule-Engine-Utility-Bill-Calculator-`
4. Railway detects Node.js automatically ✅

#### 2.3. Configure Backend Service
1. **Service Name**: `acme-backend` or `electricity-billing-backend`
2. **Root Directory**: `/backend`
3. **Build Command**: (Auto-detected from `railway.json`) ✅
4. **Start Command**: (Auto-detected from `railway.json`) ✅

#### 2.4. Add Environment Variables

Click **"Variables"** tab and add:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://your_user:password@ep-xxx.neon.tech/dbname?sslmode=require
JWT_SECRET=generate_strong_random_secret_here_use_openssl_rand_base64_32
JWT_EXPIRATION=24h
PORT=3000
ALLOWED_ORIGINS=https://your-app-name.vercel.app
CORS_ORIGIN=https://your-app-name.vercel.app
```

**⚠️ Important:**
- Use your actual Neon `DATABASE_URL` (from `.env` file)
- Generate a strong `JWT_SECRET`: 
  ```bash
  # On Windows PowerShell:
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
  ```
- `ALLOWED_ORIGINS` will be updated after Vercel deployment

#### 2.5. Deploy Backend
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Once deployed, click **"Settings"** → **"Networking"** → **"Generate Domain"**
4. **Copy your Railway URL**: `https://acme-backend-production.railway.app`

#### 2.6. Test Backend
Visit: `https://your-railway-url.railway.app/health`

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "database_type": "postgres",
  "database_version": "PostgreSQL 16.11..."
}
```

✅ **Backend is live!**

---

### **Step 3: Deploy Frontend to Vercel** ▲

#### 3.1. Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel

#### 3.2. Import Project
1. Click **"Add New..."** → **"Project"**
2. Find: `Admin-Driven-Rule-Engine-Utility-Bill-Calculator-`
3. Click **"Import"**

#### 3.3. Configure Frontend
1. **Project Name**: `acme-electricity-billing` or your choice
2. **Framework Preset**: Vite (auto-detected) ✅
3. **Root Directory**: Click "Edit" → Set to `frontend`
4. **Build Command**: `npm run build` (auto-detected) ✅
5. **Output Directory**: `dist` (auto-detected) ✅

#### 3.4. Add Environment Variable

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-railway-url.railway.app` |

**Example:**
```
VITE_API_URL=https://acme-backend-production.railway.app
```

#### 3.5. Deploy Frontend
1. Click **"Deploy"**
2. Wait ~30 seconds
3. Once deployed, you'll get a URL: `https://your-app-name.vercel.app`
4. **Copy this URL**

✅ **Frontend is live!**

---

### **Step 4: Update Backend CORS** 🔄

Now that you have your Vercel URL, update Railway:

1. Go back to **Railway Dashboard**
2. Select your backend service
3. Go to **"Variables"**
4. Update these variables:

```bash
ALLOWED_ORIGINS=https://your-actual-vercel-url.vercel.app
CORS_ORIGIN=https://your-actual-vercel-url.vercel.app
```

5. Railway will **auto-redeploy** (~1-2 minutes)

---

### **Step 5: Verify Deployment** ✅

#### 5.1. Test Backend
Visit: `https://your-railway-url.railway.app/health`
- Should show "status": "healthy" ✅
- Should show "database": "connected" ✅

#### 5.2. Test Frontend
Visit: `https://your-vercel-url.vercel.app`

**Test User Interface:**
1. ✅ Homepage loads
2. ✅ Enter consumer details
3. ✅ Calculate bill
4. ✅ View results with Tk currency
5. ✅ Download PDF

**Test Admin Interface:**
1. ✅ Go to `/admin/login`
2. ✅ Login: `admin` / `password123`
3. ✅ Update flat rate (e.g., change to 8.5 Tk)
4. ✅ See success message
5. ✅ Go back to user page
6. ✅ Calculate again - should use new rate
7. ✅ View history

---

## 🎨 Custom Domains (Optional)

### Vercel Custom Domain
1. Go to Vercel Dashboard → Project → **Settings** → **Domains**
2. Add your domain: `billing.yourdomain.com`
3. Update DNS records as instructed

### Railway Custom Domain
1. Go to Railway Dashboard → Service → **Settings** → **Networking**
2. Add your domain: `api.yourdomain.com`
3. Update DNS records as instructed

---

## 🔒 Security Checklist

After deployment, verify:

- [ ] **HTTPS enabled** (Vercel/Railway provide this automatically)
- [ ] **Strong JWT_SECRET** (not default value)
- [ ] **Database SSL enabled** (Neon uses SSL by default)
- [ ] **CORS configured** (only your Vercel domain allowed)
- [ ] **Environment variables secure** (not exposed in frontend)
- [ ] **No sensitive data in GitHub** (`.env` in `.gitignore`)

---

## 📊 Monitoring

### Railway Monitoring
- **Logs**: Railway Dashboard → Service → **Logs**
- **Metrics**: CPU, Memory, Network usage
- **Alerts**: Set up email notifications

### Vercel Analytics
- **Usage**: Vercel Dashboard → Project → **Analytics**
- **Performance**: Core Web Vitals
- **Errors**: Runtime errors

---

## 🐛 Troubleshooting

### Frontend shows "Network Error"
**Solution**: Check `VITE_API_URL` in Vercel environment variables

### Backend 500 error
**Solution**: Check Railway logs for database connection issues

### CORS errors
**Solution**: Verify `ALLOWED_ORIGINS` includes your Vercel URL

### Database connection failed
**Solution**: 
1. Check `DATABASE_URL` is correct
2. Verify Neon project is active
3. Test: `https://your-railway-url.railway.app/health`

### Build fails on Railway
**Solution**: Check `railway.json` and `nixpacks.toml` are in `/backend` directory

### Build fails on Vercel
**Solution**: Verify root directory is set to `frontend`

---

## 🔄 Redeployment

### Update Backend
```bash
git add backend/
git commit -m "Update backend"
git push
```
Railway auto-deploys from `main` branch ✅

### Update Frontend
```bash
git add frontend/
git commit -m "Update frontend"
git push
```
Vercel auto-deploys from `main` branch ✅

---

## 💰 Cost Estimation

### Free Tier Limits:

**Vercel (Free):**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains

**Railway (Free $5/month):**
- ✅ ~500 hours execution time
- ✅ Enough for small-medium apps
- ✅ Automatic HTTPS
- ⚠️ $0.01 per hour after free credits

**Neon (Free):**
- ✅ 1 project
- ✅ 10 branches
- ✅ 3 GB storage
- ✅ Enough for this project

---

## 🎯 Production URLs

After deployment, update this section:

- **Frontend**: `https://______________.vercel.app`
- **Backend**: `https://______________.railway.app`
- **Database**: Neon PostgreSQL (serverless)

---

## 📞 Support Links

- **Railway**: https://railway.app/help
- **Vercel**: https://vercel.com/support
- **Neon**: https://neon.tech/docs
- **NestJS**: https://docs.nestjs.com
- **React**: https://react.dev

---

## ✅ Deployment Complete!

Your ACME Electricity Billing System is now live in production! 🎉

**Next Steps:**
1. Share URLs with users
2. Monitor logs for errors
3. Set up custom domains (optional)
4. Enable analytics
5. Create backup admin accounts
