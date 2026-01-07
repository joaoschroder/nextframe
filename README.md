# 🎬 NextFrame

**NextFrame** is a minimalist, mobile-first web app that helps you pick your next movie in a single click.  
No browsing, no scrolling — just one poster, one button, and a surprise.

Designed to feel great on both **phones and desktops**, from small screens (iPhone SE) to large displays.

---

## ✨ Features

- 🎲 **True random movie picker** (no filters, no bias)
- 🚫 **Adult content excluded**
- 🖼️ **Responsive poster layout** (no scrolling, fits any screen)
- ⏳ **Animated loading state** (smooth, intentional feedback)
- 🔗 **Direct IMDb link** (tap the poster)
- ⚡ **Fast & cache-friendly API**
- 🌙 **Clean, modern UI** built with Tailwind CSS
- 📱 **Mobile-first design**, desktop-ready

---

## 🧠 How it works

1. The app calls a **Next.js API Route** (`/api/tmdb`)
2. The server:
   - Fetches TMDB discover metadata
   - Selects a **random page**
   - Picks a **random movie**
   - Fetches its IMDb ID
3. The client displays:
   - Movie poster
   - Title + release date
   - Clickable IMDb link

All TMDB requests are made **server-side** using a secure API token.

---

## 🛠️ Tech Stack

- **Next.js** (App Router)
- **React**
- **Tailwind CSS (v4)**
- **TMDB API**
- **IMDb**
- **Vercel** (deployment)

---

## 📁 Project Structure

```
app/
├─ api/
│  └─ tmdb/
│     └─ route.ts        # Random movie API
│
├─ components/
│  ├─ LoadingDots.tsx    # Animated loading indicator
│
├─ layout.tsx            # App layout
├─ page.tsx              # Single-page UI
├─ globals.css           # Tailwind + custom animations
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone git@github.com:joaoschroder/nextframe.git
cd nextframe
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Add environment variables

Create a `.env.local` file:

```env
TMDB_API_KEY=YOUR_TMDB_BEARER_TOKEN
```

> ⚠️ Use a **TMDB Bearer Token**, not an API key query param.

---

### 4️⃣ Run the development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🌍 Deployment (Vercel)

1. Push the repository to GitHub
2. Import the project into **Vercel**
3. Add the environment variable:
   - `TMDB_API_KEY`
4. Deploy 🚀

---

## 📱 Mobile Design Philosophy

- No vertical scrolling
- Poster scales with viewport height
- All content fits within the visible screen
- Stable viewport handling (`svh`) for iOS Safari
- Touch-friendly interactions

---

## 🧩 Future Ideas

- Prevent immediate repeats
- “Pick for today” (deterministic daily choice)
- Offline PWA shell
- Shareable movie links
- Keyboard shortcuts
- Subtle haptic-style UI feedback

---

## 📄 License

This project is open for learning and experimentation.  
Movie data provided by **TMDB**. IMDb links are used for redirection only.

---

## 🙌 Author

**João Schröder**
