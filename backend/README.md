# TwitterX Backend API

A robust REST API for the TwitterX social app, built with Node.js and MongoDB.

## ⚡ Features
- **Auth:** JWT-based authentication via `bcrypt` and `jsonwebtoken`.
- **Core:** CRUD operations for posts, comments, and likes.
- **Notifications:** Push notifications powered by Expo Server SDK.
- **Data:** MongoDB with Mongoose schemas and compound indexes.

## �️ Database Integration

The backend uses **MongoDB** with **Mongoose** (ODM) for data modeling.

### **Connection Setup**
The application connects to a MongoDB database (local or Atlas Cloud) using the `MONGODB_URI` environment variable. 
- **Local:** `mongodb://localhost:27017/twitterx`
- **Cloud (Atlas):** `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/twitterx`

> **Note:** For Vercel deployment, ensure your MongoDB Atlas "Network Access" allows `0.0.0.0/0`.

### **Data Models**
- **User:** Stores authentication credentials (hashed passwords) and profile info.
- **Post:** Text-based content with timestamps and author reference.
- **Like:** Tracks relationships between Users and Posts (with compound indexes for uniqueness).
- **Comment:** Stores replies to posts.
- **DeviceToken:** Manages Expo push tokens for notifications.

## �🚀 Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create `.env`:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=7d
   ```

3. **Start Server:**
   ```bash
   npm run dev
   ```

## 📚 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/posts` | Fetch feed (paginated) |
| `POST` | `/api/posts` | Create new post |
| `GET` | `/api/posts/:id` | Get single post |
| `DELETE` | `/api/posts/:id` | Delete post |
| `POST` | `/api/posts/:id/like` | Toggle like |
| `GET` | `/api/posts/:id/comments` | Fetch post comments |
| `POST` | `/api/posts/:id/comment` | Add comment |
| `POST` | `/api/device-tokens` | Register push token |
