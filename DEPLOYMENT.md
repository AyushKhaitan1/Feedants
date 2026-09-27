# 🚀 Live Deployment Guide

This repository is pre-configured for automated **1-Click Cloud Deployment**:
- **Frontend**: Automated build via **Vercel** (`vercel.json`)
- **Backend API**: Automated service via **Render** (`backend/render.yaml`)
- **Database**: Cloud database via **MongoDB Atlas**
- **Containerized**: Full-stack orchestration via **Docker Compose** (`docker-compose.yml`)

---

## Option 1: Vercel (Frontend) + Render (Backend) [Recommended]

### Step 1: Deploy Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in/up for free.
2. Click **Create Database** -> Choose the **M0 Free Tier**.
3. Under **Database Access**, create a user (e.g., `feedants_admin`).
4. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** -> **Drivers** -> Copy your connection string:
   ```text
   mongodb+srv://feedants_admin:<password>@cluster0.mongodb.net/feedants_competition?retryWrites=true&w=majority
   ```

---

### Step 2: Deploy Backend API (Render)
1. Go to [dashboard.render.com](https://dashboard.render.com) and sign in with GitHub.
2. Click **New +** -> **Blueprint**.
3. Select your repository: `AyushKhaitan1/Feedants`.
4. Render will automatically detect `backend/render.yaml`.
5. Under Environment Variables, set:
   - `MONGODB_URI`: Paste your MongoDB Atlas connection string from Step 1.
6. Click **Apply**.
7. Once deployed, Render will provide a live API URL:
   ```text
   https://feedants-backend.onrender.com
   ```
   *(To seed initial data, visit or send a POST request to `https://feedants-backend.onrender.com/api/seed`)*

---

### Step 3: Deploy Frontend (Vercel)
1. Go to [vercel.com/new](https://vercel.com/new) and log in with GitHub.
2. Import the repository: `AyushKhaitan1/Feedants`.
3. Vercel will automatically detect `vercel.json` (running `npx expo export --platform web` outputting to `frontend/dist`).
4. Click **Deploy**.
5. Within ~60 seconds, your React Native Web app will be live at:
   ```text
   https://feedants.vercel.app
   ```

---

## Option 2: 1-Command Docker Deployment (Local or Cloud VPS)

If deploying to AWS EC2, DigitalOcean Droplet, GCP, or a local server with Docker installed:

```bash
# Clone the repository
git clone https://github.com/AyushKhaitan1/Feedants.git
cd Feedants

# Launch MongoDB & Express API containers
docker compose up -d

# Verify services
docker compose ps
curl http://localhost:5000/api/health
```
