# Mini Social Feed App (TwitterX)

A full-stack social media application combining a Node.js/Express backend with a React Native (Expo) mobile client.

## 📂 Project Structure

This repository contains two main folders:

- **`backend/`**: Node.js + Express + MongoDB API.
- **`mobile/`**: React Native + Expo mobile application.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Android Device or Emulator (Physical device required for Notifications)

### 1. Backend Setup
Navigate to the backend folder to start the server.

```bash
cd backend
npm install
# Configure .env (see backend/README.md)
npm run dev
```

### 2. Mobile App Setup
Navigate to the mobile folder to build and run the app.

```bash
cd mobile
npm install
npm run android
```

---

## 📱 Features

### Mobile App
- **Feed:** Infinite scroll, pull-to-refresh, optimistic UI updates.
- **Interactions:** Like posts, comment on threads.
- **Create:** Post text updates (max 280 chars).
- **Notifications:** Real-time push notifications for likes/comments.
- **Responsiveness:** Optimized layout for Phones and Tablets.

### Backend API
- **Auth:** JWT-based secure authentication.
- **Database:** MongoDB with robust schemas (Users, Posts, Comments, Likes).
- **Push:** Integrated with Expo Server SDK for reliable delivery.

---

## 📥 Download APK
[Download Android APK (APK Build)](https://drive.google.com/file/d/1ZhpUVDo6kPQwuFDWCqwD0QOGx90qMc1O/view?usp=sharing)

---

## 🛠 Tech Stack
- **Frontend:** React Native, Expo SDK 54, Gluestack UI / Paper, React Query.
- **Backend:** Node.js, Express, Mongoose, MongoDB.
- **DevOps:** EAS Build (Local), Expo Push Notifications.
