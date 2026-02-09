# 💤 Dr. Imani Sleep Clinic Platform

A modern full-stack platform for Dr. Imani’s sleep clinic, designed to improve clinic branding and provide better access for patients. Features include a scalable CMS for blogs and articles, smooth animations, secure authentication, and a clean UI optimized for all devices.

---

## 🚀 Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS + Shadcn/UI**
- **Framer Motion**
- **Drizzle ORM + PostgreSQL**
- **NextAuth.js + JWT**
- **Zod + React Hook Form**

---

## ✨ Features

- 🔐 **Authentication** via NextAuth.js with JWT
- 📰 **Scalable CMS** for blogs and articles
- 🧭 **Modern UI** with Shadcn and Framer Motion
- 📱 **Fully responsive** design
- 🧪 **Type-safe** form validation with Zod + React Hook Form
- ⚙️ **Modular** and clean codebase, ready for expansion
- ⏰ **Background jobs** for payment reconciliation and appointment expiration (VPS cron—see [JOBS.md](./JOBS.md))

---

## Background Jobs

Background jobs (expire pending appointments, reconcile payments) run via VPS system cron. See [JOBS.md](./JOBS.md) for setup instructions.

---

Made with 🖤 by Babak Taghizadeh
