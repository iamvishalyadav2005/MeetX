# MeetX — Connect Beyond Limits

<div align="center">

![MeetX Banner](https://img.shields.io/badge/MeetX-Connect%20Beyond%20Limits-6366f1?style=for-the-badge&logo=webrtc&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://meet-x-git-main-vishal-yadav-s-projects1.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://meetx-backend-8ym6.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/iamvishalyadav2005/MeetX)

**A modern, production-grade full-stack real-time video conferencing and collaboration platform built using the MERN stack.**

[🚀 Live Demo](https://meet-x-git-main-vishal-yadav-s-projects1.vercel.app) · [🐛 Report Bug](https://github.com/iamvishalyadav2005/MeetX/issues) · [✨ Request Feature](https://github.com/iamvishalyadav2005/MeetX/issues)

</div>

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>
---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Author](#author)

---

## 🎯 About the Project

MeetX is a full-stack real-time video conferencing platform that enables users to create instant meeting rooms, join via unique codes, and communicate through peer-to-peer video, audio, and live chat — all from the browser with no downloads required.

Built with a modern tech stack including React.js, Node.js, Socket.IO, and WebRTC, MeetX delivers a premium user experience with glassmorphism UI, dark mode, smooth animations, and fully responsive design across all devices.

---

## 🚀 Features

- 🔐 **Secure Authentication** — JWT-based login/register with bcryptjs password hashing
- 🎥 **Real-Time Video & Audio** — Peer-to-peer WebRTC communication via SimplePeer
- 💬 **Live Chat** — Real-time in-meeting messaging via Socket.IO
- 🖥️ **Screen Sharing** — Share your screen or specific tab/window with participants
- 👥 **Multi-Participant Meetings** — Dynamic video grid that adapts to participant count
- 🔇 **Media Controls** — Toggle mic, camera, screen share, and raise hand
- 📋 **Meeting History** — Persistent log of all past meetings with rejoin functionality
- 🔗 **Shareable Meeting Codes** — Unique codes for each meeting room
- 🌙 **Dark Mode UI** — Premium glassmorphism design with smooth Framer Motion animations
- 📱 **Fully Responsive** — Optimized for desktop, tablet, and mobile devices
- ☁️ **Cloud Deployed** — Frontend on Vercel, Backend on Render, Database on MongoDB Atlas

---
## 📸 Screenshots

### Landing Page
![Landing Page](frontend/public/screenshots/landing.png)

### Authentication
![Auth Page](frontend/public/screenshots/auth.png)

### Meeting Dashboard
![Dashboard](frontend/public/screenshots/dashboard.png)

### Video Meeting Room
![Video Meet](frontend/public/screenshots/Videomeet.png)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js | UI framework |
| Framer Motion | Animations and transitions |
| MUI (Material UI) | Component library |
| Lucide React | Icon library |
| Socket.IO Client | Real-time WebSocket communication |
| SimplePeer (WebRTC) | Peer-to-peer video/audio |
| Axios | HTTP client for API calls |
| React Router DOM | Client-side routing |
| Pure CSS | Custom styling and glassmorphism |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| Socket.IO | Real-time signaling server |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Mongoose | MongoDB ODM |

### Database & Deployment
| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Cloud database |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## 📂 Project Structure

```
MeetX/
├── frontend/                     # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── pages/
│   │   │   ├── landing.jsx       # Landing page
│   │   │   ├── authentication.jsx # Login & Register
│   │   │   ├── home.jsx          # Meeting dashboard
│   │   │   ├── VideoMeet.jsx     # Video call interface
│   │   │   └── history.jsx       # Meeting history
│   │   ├── environment.js        # API base URL config
│   │   ├── App.js                # Routes
│   │   └── index.js              # Entry point
│   ├── package.json
│   └── .env.production
│
├── backend/                      # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── user.controller.js  # Auth logic
│   │   │   └── socketManager.js    # Socket.IO logic
│   │   ├── models/
│   │   │   ├── user.model.js       # User schema
│   │   │   └── meeting.model.js    # Meeting schema
│   │   ├── routes/
│   │   │   └── users.routes.js     # API routes
│   │   └── app.js                  # Express server
│   └── package.json
│
└── README.md
```

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/iamvishalyadav2005/MeetX.git
cd MeetX
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

### Environment Variables

**Backend — create `backend/.env`:**

```env
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/meetx?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000
```

**Frontend — `src/environment.js`:**

```js
let IS_PROD = false; // set to true for production

const server = IS_PROD
  ? "https://meetx-backend-8ym6.onrender.com"
  : "http://localhost:8000";

export default server;
```

> ⚠️ Never commit your `.env` file. It is already added to `.gitignore`.

### Running Locally

**Terminal 1 — Start the backend:**

```bash
cd backend
npm run dev
```

You should see:
```
MONGO Connected — Host: cluster0.xxxxx.mongodb.net
Server listening on PORT 8000
```

**Terminal 2 — Start the frontend:**

```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints

Base URL: `https://meetx-backend-8ym6.onrender.com/api/v1/users`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login and get JWT token | ❌ |
| `GET` | `/get_all_activity` | Get meeting history | ✅ |
| `POST` | `/add_to_activity` | Save meeting to history | ✅ |

### Request & Response Examples

**Register:**
```json
// POST /register
// Body:
{
  "name": "Vishal Yadav",
  "username": "vishal123",
  "password": "securepassword"
}

// Response:
{
  "message": "User registered successfully"
}
```

**Login:**
```json
// POST /login
// Body:
{
  "username": "vishal123",
  "password": "securepassword"
}

// Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "vishal123",
  "name": "Vishal Yadav"
}
```

---

## 🌐 Deployment

### Frontend — Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Set **Root Directory** to `frontend`
4. Set **Framework** to `Create React App`
5. Add environment variable: `DISABLE_ESLINT_PLUGIN = true`
6. Deploy

### Backend — Render

1. Go to [render.com](https://render.com) and create a new Web Service
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `node src/app.js`
6. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `NODE_VERSION = 20`
7. Deploy

### Live URLs

| Service | URL |
|---------|-----|
| 🌐 Frontend | [meet-x-git-main-vishal-yadav-s-projects1.vercel.app](https://meet-x-git-main-vishal-yadav-s-projects1.vercel.app) |
| ⚙️ Backend | [meetx-backend-8ym6.onrender.com](https://meetx-backend-8ym6.onrender.com) |

> 💡 **Note:** The backend is hosted on Render's free tier and may take 30-60 seconds to wake up after inactivity.

---

## 🧪 How to Test

1. Open the [live demo](https://meet-x-git-main-vishal-yadav-s-projects1.vercel.app)
2. Register two accounts (use different browsers or incognito)
3. Login with Account 1 → click **Start Meeting** → copy the meeting code
4. Login with Account 2 → enter the meeting code → click **Join Meeting**
5. Both users should now see each other in the video grid
6. Test chat, mute, camera toggle, screen share, and raise hand

---

## 👨‍💻 Author

**Vishal Yadav**

- GitHub: [@iamvishalyadav2005](https://github.com/iamvishalyadav2005)
- Project Link: [https://github.com/iamvishalyadav2005/MeetX](https://github.com/iamvishalyadav2005/MeetX)
- Live Demo: [https://meet-x-git-main-vishal-yadav-s-projects1.vercel.app](https://meet-x-git-main-vishal-yadav-s-projects1.vercel.app)

---

<div align="center">

Made with ❤️ by Vishal Yadav

⭐ Star this repo if you found it helpful!

</div>
