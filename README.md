# Feedants Competition Details — Full Stack Assignment

## Tech Stack
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: React Native (Expo)
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Security**: Helmet, CORS, express-rate-limit

---

## Project Structure
```
feedants/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── constants/
    │   ├── hooks/
    │   ├── navigation/
    │   ├── screens/
    │   └── services/
    └── App.js
```

---

## Setup & Run

### Prerequisites
- Node.js 20+
- MongoDB 7.0 (running locally)
- Expo Go app on phone

### Backend
```bash
cd backend
npm install
# Create .env (see .env.example below)
node seed.js       # seed database once
npm run dev        # starts on port 5000
```

### Frontend
```bash
cd frontend
npm install
# Set BASE_URL in src/services/api.js to http://<YOUR_LAN_IP>:5000/api
# Set BASE_URL in App.js login call to same IP
npx expo start
# Scan QR with Expo Go — phone must be on same WiFi
```

### .env
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/feedants
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

## Features Implemented

### Backend
- JWT authentication (register, login, protected routes)
- Competition detail API with user-specific state
- **Atomic spot booking** — `findOneAndUpdate` with `$expr: { $lt: ['$bookedSpots', '$totalSpots'] }` prevents overselling under concurrent load
- **Competition state machine** — computed from dates via Mongoose virtual (upcoming → registration_open → submission_open → closed → result_announced)
- **In-memory caching** — TTL-based cache (60s) on competition detail endpoint; invalidated immediately on registration
- Entry submission endpoint
- Referral system (generate link, apply code, earn ₹10/signup)
- `optionalAuth` middleware — serves anonymous + authenticated users from same endpoint
- Global error handler with stack traces in dev only
- Helmet security headers
- Rate limiting — 200 req / 15 min on all `/api` routes
- Duplicate registration guard — unique index on `(userId, competitionId)` + `err.code === 11000` fallback

### Frontend
- Competition details screen matching provided design
- Live countdown timer (ticks every second)
- Spots progress bar with real-time availability
- Important dates grid
- Previous winners horizontal scroll with video play overlay
- Tabbed content (About / Judging Parameters / Rules & Eligibility) with expand/collapse
- Rewards table (1st–6th positions)
- Refer & Earn section with clipboard copy
- Sticky CTA button — state-aware (Register Now / Upload Submission / Registered / Spots Full)
- Loading indicator on app start (waits for auth before rendering)
- Error state with retry button on competition fetch failure
- Language toggle UI (ENG / हिंदी)

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/competitions` | Optional | List competitions |
| GET | `/api/competitions/:id` | Optional | Competition detail + user state |
| POST | `/api/competitions/:id/register` | Yes | Register for competition |
| POST | `/api/competitions/:id/submit` | Yes | Submit entry URL |
| GET | `/api/referrals/link/:competitionId` | Yes | Get referral link |
| POST | `/api/referrals/apply` | Yes | Apply referral code |

---

## Technical Decisions

**Atomic spot booking** — single `findOneAndUpdate` with a conditional filter prevents race conditions without needing MongoDB transactions. Two simultaneous requests cannot both claim the last spot.

**Virtual status field** — competition status is derived from dates on every read rather than stored. Always accurate, no cron job needed.

**In-memory cache** — reduces DB load on hot competition pages. TTL of 60s balances freshness vs performance. Cache is invalidated immediately on any registration to keep spot count accurate. Production would use Redis.

**optionalAuth middleware** — competition detail endpoint works for both anonymous and authenticated users. User-specific state (registered badge, CTA) only included when token is present.

---

## Known Limitations / Production TODOs

- **Video upload**: Submission URL is a string — production would use pre-signed S3 or Cloudinary URLs
- **i18n**: ENG/हिंदी toggle is UI-only — production would use `react-i18next`
- **Auth flow**: Test user auto-login in `App.js` — production would have a login screen
- **Cache**: In-memory (lost on restart) — production would use Redis
- **Push notifications**: Not implemented — Expo + FCM for competition lifecycle events

---

## Test Credentials
```
Email:    atharv@test.com
Password: password123
```
