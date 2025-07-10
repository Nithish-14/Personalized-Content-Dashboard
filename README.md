# Personalized Content Dashboard

A responsive, interactive content dashboard built with **Next.js**, **React**, **TypeScript**, **Redux Toolkit**, and **Tailwind CSS**. It aggregates and displays personalized news, movie recommendations, and social media content based on user preferences.

---

## 🚀 Features

* 🔄 **Personalized Content Feed** with News, Movies (OMDb), and Social Posts
* 🔍 **Search with Debounced Input**
* 🌟 **Favorites Section**
* 🔥 **Trending Content** fetched from NewsAPI (via backend proxy) and OMDb
* 🌙 **Dark Mode Toggle**
* 📦 **Drag-and-drop** support (Framer Motion)
* 🧠 **State management** using Redux Toolkit + Async Thunks

---

## 🧰 Tech Stack

* [Next.js](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Redux Toolkit](https://redux-toolkit.js.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Framer Motion](https://www.framer.com/motion/)
* [NewsAPI](https://newsapi.org/) (proxied via backend)
* [OMDb API](https://www.omdbapi.com/)
* [Express.js](https://expressjs.com/) (backend for API proxy)

---

## 🛠 Setup Instructions

### 1. **Clone the Repo**

```bash
git clone https://github.com/Nithish-14/Personalized-Content-Dashboard.git
cd Personalized-Content-Dashboard
```

### 2. **Install Dependencies**

```bash
# For frontend
cd frontend
npm install

# For backend
cd ../backend
npm install
```

### 3. **Environment Variables**

Create `.env` files:

**frontend/.env.local**

```env
VITE_OMDB_API_KEY=your_omdb_api_key
VITE_NEWS_PROXY_URL=http://localhost:5000/api/news
```

**news-backend/.env**

```env
NEWS_API_KEY=your_newsapi_key
PORT=5000
```

> 🔑 You can get free API keys from [NewsAPI](https://newsapi.org/) and [OMDb API](https://www.omdbapi.com/apikey.aspx).

### 4. **Run the Apps**

```bash
# Start backend (in news-backend directory)
npm run dev

# Start frontend (in frontend directory)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Folder Structure

```
├── frontend/          # React + Vite + Redux + Tailwind
│   ├── components
│   ├── pages
│   ├── store
│   └── .env.local
│
├── news-backend/      # Express server (API proxy for NewsAPI)
│   ├── routes/
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## 📦 Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend (optional - for deployment)
cd ../backend
npm run build
```

---

## 👨‍💻 Author

* Built by Nithish M
* GitHub: [@Nithish-14](https://github.com/Nithish-14)
