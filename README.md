# Feedants - Competition Details Screen (Full-Stack Module)

> **Technical Assignment**: Full Stack Development Internship  
> **Company**: Feedants  
> **Feature**: Competition Details Screen — Functional Full-Stack Module  
> **Design Reference**: Feedants Classical Dance Screen Mockup

---

## 📌 Executive Summary

This repository delivers an end-to-end, production-ready full-stack module for the **Feedants Competition Details** screen. Rather than presenting a static visual mockup, every single data point, badge, countdown timer, participation spot count, and call-to-action button is dynamically driven by a **Node.js + Express + MongoDB** backend.

The application incorporates strict **atomic concurrency control**, preventing race conditions and overbooking when thousands of participants simultaneously register for limited competition spots.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React Native (Expo SDK 57)** | Cross-platform mobile architecture (iOS, Android, Web) |
| **Icons & UI** | `@expo/vector-icons`, Custom Theme | Feather, Ionicons, and pixel-precise color styling |
| **Backend** | **Node.js (v22+) + Express.js** | Modular REST API with layered architecture |
| **Database** | **MongoDB (v8.2+) with Mongoose** | Document database with compound indexes & atomic updates |
| **Validation** | Express-Validator & Mongoose Schema | Strict pre-save and query-level validations |

---

## 🏗 Architecture & Repository Structure

```text
feedants-competition/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Resilient MongoDB connection logic
│   │   ├── models/
│   │   │   ├── Competition.js        # Competition schema, virtuals, and lifecycle states
│   │   │   ├── Registration.js       # Unique (competition, user) index & payment records
│   │   │   ├── Submission.js         # Video entries, judging parameters & feedback
│   │   │   └── User.js               # Participant profiles & referral codes
│   │   ├── services/
│   │   │   └── registrationService.js # Atomic conditional updates for zero overbooking
│   │   ├── controllers/
│   │   │   ├── competitionController.js
│   │   │   ├── registrationController.js
│   │   │   ├── submissionController.js
│   │   │   └── userController.js
│   │   ├── routes/                   # Clean REST route definitions
│   │   ├── seed/
│   │   │   └── seed.js               # Populates exact data from Objective_Page.png
│   │   └── server.js                 # Express app, CORS, Morgan logger, error handling
│   ├── tests/
│   │   └── concurrency.test.js       # Automated race-condition & stress-testing script
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── assets/                       # Local assets and icons
│   ├── src/
│   │   ├── theme/
│   │   │   └── colors.js             # Design tokens matching Objective_Page.png
│   │   ├── services/
│   │   │   └── api.js                # Universal API client (Web, Android 10.0.2.2, iOS)
│   │   ├── context/
│   │   │   └── AppContext.js         # Reactive global state, persona switching & modals
│   │   ├── components/
│   │   │   ├── Header.js             # Status bar, back navigation, ENG/हिंदी toggle
│   │   │   ├── MainCompetitionCard.js# Title, spots progress, prize pool, tags
│   │   │   ├── JudgeCard.js          # Manju Dubey profile & "Intro Video" trigger
│   │   │   ├── CountdownBanner.js    # Live real-time ticker (01d : 06h : 28m : 32s)
│   │   │   ├── ImportantDatesGrid.js # 2x2 grid with calendar/upload/trophy icons
│   │   │   ├── PreviousWinners.js    # Horizontal carousel with playable winner previews
│   │   │   ├── CompetitionTabs.js    # About, Judging Parameters, Rules & Eligibility
│   │   │   ├── RewardsSection.js     # 1st to 6th rank prizes & disclaimer banner
│   │   │   ├── TrustSection.js       # Prize disbursement video & Razorpay assurance
│   │   │   ├── ReferEarnBanner.js    # Link copy with clipboard feedback & share
│   │   │   ├── TestimonialBanner.js  # Participant reviews drawer
│   │   │   ├── AdBanner.js           # Dashed advertisement placeholder
│   │   │   ├── BottomCTA.js          # Sticky contextual action bar
│   │   │   ├── BottomNavBar.js       # Home, Explore, (+), Competitions, Profile
│   │   │   ├── PaymentModal.js       # Razorpay checkout simulation modal
│   │   │   ├── SubmissionModal.js    # Performance upload sheet with style selection
│   │   │   ├── VideoPlayerModal.js   # HD player modal with playback controls
│   │   │   ├── DemoControlSheet.js   # Testing console for reviewers & evaluators
│   │   │   └── PolicyModal.js        # Refund policy and testimonials view
│   │   └── screens/
│   │       └── CompetitionDetailScreen.js # Master screen layout with pull-to-refresh
│   ├── App.js
│   ├── app.json
│   └── package.json
└── README.md
```

---

## ⚡ Concurrency & Data Consistency Strategy

### The Problem
In high-demand competitions (e.g. 19 spots remaining or the final 1 spot), thousands of participants may click **"Register Now"** at the exact same millisecond. Traditional check-then-insert code causes race conditions:
```js
// INSECURE (Classic Race Condition):
const comp = await Competition.findById(id);
if (comp.spotsBooked < comp.maxSpots) {
  // If 50 requests reach this line before any write finishes, ALL 50 will register!
  await Competition.updateOne({ _id: id }, { $inc: { spotsBooked: 1 } });
}
```

### The Solution: Atomic Conditional Execution & Idempotency
Our `registrationService.js` enforces concurrency protection at the database engine level:

1. **Atomic Conditional Updates**:
   ```javascript
   const reservedCompetition = await Competition.findOneAndUpdate(
     {
       _id: competitionId,
       $expr: { $lt: ['$spotsBooked', '$maxSpots'] }, // Atomic write condition
       status: { $in: ['REGISTRATION_OPEN', 'UPCOMING'] },
     },
     {
       $inc: { spotsBooked: 1 },
     },
     {
       returnDocument: 'after',
     }
   );
   ```
   If all spots are claimed at the microsecond of execution, MongoDB returns `null`. No spot is allocated, and the request is immediately rejected with a clean `SPOTS_FULL` status.

2. **Database-Level Compound Unique Index**:
   ```javascript
   registrationSchema.index({ competition: 1, user: 1 }, { unique: true });
   ```
   Guarantees that no user can ever register twice, even if they submit concurrent duplicate requests.

3. **Compensating Rollback**:
   If creating the registration document fails for any reason (e.g. unique constraint violation or payment gateway failure), an atomic rollback immediately decrements `spotsBooked: -1` to release the reserved spot back to other waiting participants.

---

## 🧪 Concurrency Automated Stress Test

You can verify the concurrency safety anytime by running the dedicated test script:

```bash
cd backend
npm run test:concurrency
```

### What this test does:
1. Creates a competition with total 10 spots, where 7 are already booked (**only 3 spots remaining**).
2. Spawns **20 concurrent user accounts**.
3. Fires all 20 registration requests **simultaneously via `Promise.allSettled`**.
4. **Asserts that**:
   - Exactly 3 requests succeed.
   - Exactly 17 requests are cleanly rejected.
   - `spotsBooked` in MongoDB is exactly 10 (Zero Overbooking).
   - Database registration documents match exactly 3 new entries.

---

## 🚀 Step-by-Step Setup & Running Instructions

### 1. Prerequisites
- **Node.js**: v18.x or v20.x or v22.x
- **npm**: v9+ or v10+
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI.

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
copy .env.example .env

# Seed initial database with exact data from Objective_Page.png
npm run seed

# Start Express server in development mode (with nodemon)
npm run dev
# Or production mode:
npm start
```

The backend server will start on `http://localhost:5000`.  
Verify health by visiting: `http://localhost:5000/api/health`

---

### 3. Frontend Setup (React Native with Expo)

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies (already resolved in repo)
npm install

# Run on Web (recommended for instant browser review):
npm run web

# Or run with Expo interactive launcher (for Android / iOS Expo Go):
npm start
```

The web application opens at `http://localhost:8081` (or next available port).

---

## ⚙️ Environment Variables

### Backend (`backend/.env`):
```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/feedants_competition
NODE_ENV=development
```

---

## 📱 Interactive Feature Highlights & Testing Guide

An **Evaluator Console** is embedded directly into the application (accessible via the user badge on the top right or the center `+` button in the navigation bar):

1. **User Persona Switching**:
   - **Rohan Sharma** (Registered Default): Displays the screen in the registered state (`✔ Registered` badge, CTA: `Upload Submission / Registered`).
   - **Priya Patel** (Unregistered): Displays the screen in the unregistered state (Badge: `Registration Open`, CTA: `Register Now • ₹99`, Spots: `1 / 20 Booked`).
   - **Ananya Sen**: Displays post-submission state (`Submission Uploaded / Under Review`).

2. **Razorpay Payment Simulation**:
   - Clicking `Register Now • ₹99` launches the checkout modal.
   - Upon confirming payment, an atomic spot reservation takes place in MongoDB, the spot counter increments in real-time, and the screen seamlessly transitions to `Upload Submission`.

3. **Performance Video Submission**:
   - Clicking `Upload Submission` opens the submission form.
   - Enter performance title, select dance style (Kathak, Bharatanatyam, Odissi, etc.), and provide video/drive URL.
   - Saves to MongoDB under `Submission` collection and updates screen state.

4. **Live Countdown Timer**:
   - Real-time ticker counting down `01d : 06h : 28m : 32s` second-by-second.

5. **Bilingual Language Toggle**:
   - Tap `ENG` or `हिंदी` in the top app bar to instantly translate section titles, labels, dates, and buttons.

6. **Interactive Video Players**:
   - Tap `Intro Video` on Judge Manju Dubey's card or any card in `Previous Winners` to launch the HD video player modal with playback controls.

7. **Refer & Earn**:
   - Click `Copy Link` to copy the referral link to clipboard with instant toast alert feedback, or click `Refer Now` to launch the native share sheet.

---

## 🧠 Design Rationale, Assumptions & Production Trade-offs

### Important Assumptions
1. **Curated Class Sizes**: Classical dance competitions under maestro evaluation generally cap slots (e.g. 20 participants per batch) to ensure the judge can provide qualitative video review.
2. **One Entry Per User**: To maintain tournament integrity, each authenticated user can register once per competition and submit one official video entry.
3. **Razorpay Webhook Handshake**: In production, the client calls `/api/payment/orders`, Razorpay completes the transaction, and an HMAC-signed webhook (`/api/payment/verify`) finalizes the registration record. For this assignment, an integrated checkout sheet demonstrates the exact database write flow.

### Major Technical Decisions
1. **React Native with Expo**: Enables 100% native component fidelity for iOS and Android devices, while simultaneously providing web bundling for live browser review.
2. **MongoDB Atomic Operations over Distributed Locks**: By leveraging MongoDB's `$expr: { $lt: ['$spotsBooked', '$maxSpots'] }` with `findOneAndUpdate`, we achieve sub-millisecond atomic locking directly within the database engine without introducing the operational overhead of a Redis cluster for small-to-medium deployments.
3. **Optimistic UI with Synchronized State**: Actions like spot registration, tab switching, and persona selection update local state optimistically while validating against the backend API to ensure data consistency.

### Trade-offs Considered
- **WebSockets / Server-Sent Events (SSE) vs Polling**:
  - *Trade-off*: We used reactive REST calls with pull-to-refresh and event-driven updates.
  - *Production Path*: For viral drops (e.g. 50,000 users attempting to register in 10 seconds), adding Redis Pub/Sub with SSE or WebSocket channels would broadcast remaining spot counters to all connected screens in real-time.
- **Relational SQL vs MongoDB Document Model**:
  - *Trade-off*: MongoDB was required by the assignment brief. We modeled hierarchical competition details (judging parameters, previous winners, rewards) within a single fast-reading document to minimize multi-table join latency.

### Production Scaling Roadmap
If developing this further for millions of active users:
1. **Redis Caching**: Cache competition static details in Redis with a 60-second TTL to offload 95% of read queries from MongoDB.
2. **Direct-to-S3 Multipart Uploads**: For dance performance videos (often 200MB+ in 1080p/4K), generate AWS S3 Presigned URLs so mobile clients upload media directly to S3/CloudFront, bypassing the Node.js API servers.
3. **Asynchronous Video Transcoding**: Trigger AWS MediaConvert or Cloudinary jobs upon upload to transcode submissions into HLS multi-bitrate streams for seamless playback on judges' devices.
4. **Rate Limiting & DDoS Shield**: Implement Cloudflare edge caching and express-rate-limit to protect registration endpoints from automated bot spamming.

---

## 📄 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/competitions/featured` | Fetch featured competition details with user context |
| `GET` | `/api/competitions/:id` | Fetch specific competition details |
| `POST` | `/api/competitions/:id/reset`| Reset spots and registrations for demo testing |
| `POST` | `/api/registrations` | Atomically register user for competition |
| `GET` | `/api/registrations/:compId/user/:userId` | Get user registration status |
| `POST` | `/api/registrations/simulate-concurrency` | Fire concurrent registration stress test |
| `POST` | `/api/submissions` | Upload performance video entry |
| `GET` | `/api/submissions/:compId/user/:userId` | Get performance review status |
| `GET` | `/api/users` | List test user accounts |
| `GET` | `/api/health` | Service uptime and health check |
| `POST` | `/api/seed` | Seed initial database records |



