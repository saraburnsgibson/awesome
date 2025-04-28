# Tiny Towns Online Game

This project is a full-stack web app that allows users to log in, play a Tiny Towns-style strategy game, save games to Firebase, and view results.

Built with **React** (frontend), **Express** (backend), and **Firebase** (authentication and database).

---

## 🚀 Quick Start

### 1. Clone This Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Install Prerequisites

Ensure you have:
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

Then install the dependencies:

```bash
npm install
```

### 3. Set Up Firebase

Create a Firebase project at [Firebase Console](https://console.firebase.google.com/):

- **Authentication:**
  - Enable **Email/Password** sign-in.
  - Enable **Google** sign-in.
- **Firestore Database:**
  - Set up Firestore (test or production mode).
- **Service Account:**
  - Go to **Project Settings > Service accounts**.
  - Generate a new private key and download it.
  - Save it in the project root as `serviceAccountKey.json`.

Create a `firebaseConfig.json` file in the root using your Web App credentials:

```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_AUTH_DOMAIN",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_STORAGE_BUCKET",
  "messagingSenderId": "YOUR_SENDER_ID",
  "appId": "YOUR_APP_ID"
}
```

### 4. Run Locally

Start the backend server:

```bash
npm run start
```

Start the frontend dev server (in another terminal window):

```bash
npm run dev
```

### 5. Play the Game!

Open [http://localhost:5173](http://localhost:5173) in your browser.

- Register or log in.
- Place resources.
- Build buildings.
- End your game and view your game summary!


---

## 🔍 How the Project Works

- **Authentication**: Firebase Authentication (Email/Password + Google)
- **Database**: Firestore for storing game data.
- **Frontend**: React + Vite.
- **Backend**: Express server with CORS and Firebase Admin SDK.
- **Build Tooling**: ESLint + Vitest + Vite


---

## 📅 Available Commands

| Command | Description |
| :------ | :---------- |
| `npm run dev` | Start frontend dev server |
| `npm run start` | Start backend server |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview built frontend |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run coverage` | Generate test coverage report |

---

## 📖 Project Structure

```plaintext
public/
  └── index.html, end.html, firebaseConfig.json
src/
  ├── app.jsx
  ├── end.jsx
  ├── EndScreen.jsx
  ├── main.js
  ├── store.js
  ├── utils.js
  ├── BuildingStore.jsx
  ├── ResourceSelector.jsx
  ├── TownGrid.jsx
  └── tinytowns.css
server.js
serviceAccountKey.json
package.json
README.md
```


---

## 🚪 Deployment

- Deploy frontend separately (e.g., **Vercel**, **Netlify**, **Firebase Hosting**).
- Deploy backend server (e.g., **Railway**, **Render**, **Heroku**).

If you use environment variables for production, remember to configure:
- `VITE_BACKEND_PORT`
- Proper Firebase environment variables.

---

## 💪 Ready to Play!

That's it! Now you can enjoy your own Tiny Towns online experience. 🏘️ 
Thanks! -Sara Burns Gibson and Daniel Alexander
