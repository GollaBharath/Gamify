<div align="center">

# 🕹️ GAMIFY — Turn Any Goal into a Game

</div>

<div align="center">

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Discord.js](https://img.shields.io/badge/Bot-Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Contributors](https://img.shields.io/github/contributors-anon/GollaBharath/GollaBharath?style=for-the-badge)

### **🎯 An open-source platform to gamify productivity, collaboration, and community engagement.**

</div>

---

## 💡Concept Note

> Click [here](./Concept_Note.md) to learn more about the project.

---

## 📊 Project Statistics

<div align="center">

<table>
<tr>
<td align="center">
<img src="https://img.shields.io/github/stars/gollabharath/gamify?style=social" alt="GitHub Stars">
<br><b>Stars</b>
</td>
<td align="center">
<img src="https://img.shields.io/github/forks/gollabharath/gamify?style=social" alt="GitHub Forks">
<br><b>Forks</b>
</td>
<td align="center">
<img src="https://img.shields.io/github/issues/gollabharath/gamify" alt="GitHub Issues">
<br><b>Open Issues</b>
</td>
<td align="center">
<img src="https://img.shields.io/github/issues-closed/gollabharath/gamify" alt="Closed Issues">
<br><b>Closed Issues</b>
</td>
<td align="center">
<img src="https://img.shields.io/github/issues-pr/gollabharath/gamify" alt="Open PRs">
<br><b>Open PRs</b>
</td>
<td align="center">
<img src="https://img.shields.io/github/issues-pr-closed/gollabharath/gamify" alt="Closed PRs">
<br><b>Closed PRs</b>
</td>
<td align="center">
<img src="https://img.shields.io/github/contributors/gollabharath/gamify" alt="GitHub Contributors">
<br><b>Contributors</b>
</td>
<td align="center">
<img src="https://img.shields.io/github/commit-activity/m/gollabharath/gamify" alt="Commits per Month">
<br><b>Commits</b>
</td>
<td align="center">
<img src="https://img.shields.io/github/repo-size/gollabharath/gamify" alt="Repo Size">
<br><b>Project Size</b>
</td>
</tr>
</table>

</div>

---

<details>
  <summary><strong>📑 Table of Contents</strong></summary>

- [💡 Why Choose Gamify?](#-why-choose-gamify)
- [🚀 Core Features](#-core-features)
- [🧱 Tech Stack & Architecture](#-tech-stack--architecture)
- [⚙ Folder Structures](#-folder-structures)
  - [Frontend folder structure](#frontend-folder-structure)
  - [Backend folder structure](#backend-folder-structure)
- [⚡ Quick Start / Installation](#-quick-start--installation)
- [🤝 Contributing](#-contributing)
- [🎖️ Contributors](#-contributors)
- [📄 License](#-license)

</details>

---

## 💡 Why Choose Gamify?

- 🆓 **Free & Open-Source** — MIT licensed and community-driven
- 🛠️ **Fully Self-Hostable** — Complete control over your data and deployment
- 🌍 **Multi-Platform** — Web dashboard and Discord integration
- 🧱 **Modular Architecture** — Easy to customize and extend
- 🎮 **Gamify Anything** — From study groups to corporate teams
- 🧑‍🤝‍🧑 **Built for Teams & Communities** — Role-based collaboration baked in

---

## 🚀 Core Features

- 🎯 **Event Creation** — Define your own events, tasks, and currency system
- 👥 **Role-Based Permissions** — Owners, Admins, Moderators, Members
- ✅ **Task Management** — Admins create tasks, moderators verify them
- 🎁 **Reward Store** — Members redeem points for real or virtual rewards
- 🖥️ **Web Dashboard** — Full-featured dashboard for managing events
- 🤖 **Discord Bot** — Seamless interaction with Discord for members

---

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" width="550" height="80">
  <rect width="550" height="80" rx="20" fill="#0000"/>
  <text x="50%" y="50%" fill="#fff" font-size="24" font-family="Comic Sans MS, sans-serif" font-weight="bold" dominant-baseline="middle" text-anchor="middle">
    🎉 Project Events & Highlights
  </text>
</svg>

<image src="https://github.com/user-attachments/assets/2697ede8-aa67-4b57-b913-edf6de969249">

<br>

<a href="https://gssoc.girlscript.tech/"><img src="https://github.com/user-attachments/assets/06b414f8-fcc4-440a-9ab1-277673df14a7" alt="Events Heading" style="border-radius:20px;"/></a>
<a href="https://www.osconnect.org/"><img src="https://github.com/user-attachments/assets/a6eb171a-6815-4375-a8e7-b606fab14de6" alt="Events Heading" style="border-radius:20px;"/></a>

</div>

---

## 🧱 Tech Stack & Architecture

<div align="center">

<table>
<tr>
<th>Directory</th>
<th>Description</th>
<th>Technology</th>
</tr>

<tr>
<td><code>client/</code></td>
<td>Frontend UI built with React</td>
<td>React, Tailwind CSS</td>
</tr>

<tr>
<td><code>server/</code></td>
<td>RESTful API backend</td>
<td>Node.js, Express</td>
</tr>

<tr>
<td><code>bot/</code></td>
<td>Discord companion bot</td>
<td>Discord.js</td>
</tr>

<tr>
<td><code>Database</code></td>
<td>Stores events, users, tasks, and rewards</td>
<td>MongoDB</td>
</tr>
</table>

</div>

---

## ⚙ Folder Structures

### Frontend folder structure

```
client/
├─ public/
│  └─ vite.svg
├─ src/
│  ├─ components/
│  │  ├─ Footer.jsx
│  │  ├─ Home.jsx
│  │  ├─ Navbar.jsx
│  │  └─ ScrollToTop.jsx
│  ├─ Context/
│  │  └─ AuthContext.jsx
│  ├─ pages/
│  │  ├─ About.jsx
│  │  ├─ AuthForms.jsx
│  │  ├─ Contact.jsx
│  │  ├─ Dashboard.jsx
│  │  └─ Profile.jsx
│  ├─ routes/
│  │  └─ ProtectedRoute.jsx
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
└─ Additional Documentation

```

### Backend folder structure

```
server/
├─ config/
│  └─ db.js
├─ controllers/
│  ├─ authController.js
│  └─ userController.js
├─ middlewares/
│  └─ authMiddleware.js
├─ models/
│  └─ User.js
├─ routes/
│  ├─ authRoutes.js
│  └─ userRoutes.js
└─ Additional Documentation

```

## ⚡ Quick Start / Installation

### Prerequisites

- Node.js (v16+)
- MongoDB (Atlas or local)
- A Discord Bot Token ([Get one here](https://discord.com/developers/applications))

### 1. Clone the Repository

```bash
git clone https://github.com/gollabharath/gamify.git
cd gamify
```

### 2. Install Dependencies

```bash
cd client && npm install
cd ../server && npm install
cd ../bot && npm install
```

### 3. Setup Environment Variables

Create `.env` files in `client/`, `server/`, and `bot/` directories.

#### Example: `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_password

# Rate limiting for authentication endpoints
AUTH_LOGIN_MAX=10
AUTH_LOGIN_WINDOW_MS=900000
AUTH_REGISTER_MAX=5
AUTH_REGISTER_WINDOW_MS=3600000
```

#### Rate Limiting Configuration

The server includes rate limiting for authentication endpoints to prevent abuse:

- **Login Protection**: `AUTH_LOGIN_MAX` attempts per `AUTH_LOGIN_WINDOW_MS` milliseconds (default: 10 per 15 minutes)
- **Registration Protection**: `AUTH_REGISTER_MAX` attempts per `AUTH_REGISTER_WINDOW_MS` milliseconds (default: 5 per hour)

When limits are exceeded, endpoints return:

```json
{
  "success": false,
  "message": "Too many login attempts. Try again later."
}
```

#### Example: `bot/.env`

```env
DISCORD_TOKEN=your_discord_bot_token
GUILD_ID=your_guild_id
API_URL=http://localhost:5000
```

### 4. Run the App

#### In separate terminals:

```bash
# Terminal 1 (For Backend)
cd server && npm run dev

# Terminal 2 (For Frontend)
cd client && npm run dev

# Terminal 3 (For Bot)
cd bot && node index.js
```

---

## 🤝 Contributing

We love contributions from the community! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

> For major changes, please open an issue first to discuss what you’d like to change.

---

## 🎖️ Contributors

We are grateful to all the amazing contributors who have helped make this project better! 🌟

<div align="center">

### 👨‍💻 Meet Our Contributors

[![Contributors](https://contrib.rocks/image?repo=GollaBharath/Gamify)](https://github.com/GollaBharath/Gamify/graphs/contributors)

</div>

---

## 📄 License

This project is licensed under the **MIT License**.

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://github.com/gollabharath/gamify/blob/main/LICENSE)

</div>

---
