# PrimeBid - MERN Auction Platform

## Project Description

PrimeBid is a full-stack online auction platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to create auctions, place bids, and manage auction transactions through an interactive interface.

---

## Features

- User Authentication (Register/Login)
- Create Auction Items
- View Auction Listings
- Place Bids
- Payment Integration (Razorpay)
- Admin Dashboard & Commission Tracking

---

## Tech Stack

- Frontend: React.js (Vite)
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Cloud Storage: Cloudinary
- Payment: Razorpay
- Email: Nodemailer

---

## Setup Instructions

### 1. Clone Repository

git clone https://github.com/Akashkuvadiya/mern-auction-app.git

### 2. Install Dependencies

cd backend
npm install

cd ../frontend
npm install

### 3. Environment Variables

Create `.env` file inside backend folder:
PORT=5000
MONGO_URI=mongodb://akashkuvadiya17_db_user:Akash123@ac-5veyxyh-shard-00-00.lzsbdgk.mongodb.net:27017,ac-5veyxyh-shard-00-01.lzsbdgk.mongodb.net:27017,ac-5veyxyh-shard-00-02.lzsbdgk.mongodb.net:27017/mern_auction?ssl=true&replicaSet=atlas-yysb6i-shard-0&authSource=admin&retryWrites=true&w=majority

JWT_SECRET_KEY=jwtmhtngrbfevdwcsqzakuliop

CLOUDINARY_CLOUD_NAME=CLOUDINARY_CLOUD_NAME=dugu4z6nm

CLOUDINARY_API_KEY=118951883129756

CLOUDINARY_API_SECRET=jjupaIWJBHHb-zYJFIEpAf3LCek

RAZORPAY_KEY_ID=rzp_test_us_SKdQRPcEgu0Rvd

RAZORPAY_KEY_SECRET=uV4RbmbbB8y9z4Ak3KtbTfBN

SMTP_MAIL=akash.apollo17@gmail.com

SMTP_PASSWORD=bshj zawv hqit qhtg

---

### 4. Run Application

Backend:npm run dev
Frontend:npm start

---

## Demo Features

- Login / Register
- Create Auction
- View Auction
- Place Bid
- Payment (Razorpay)

---

## Note

Sensitive data such as API keys and environment variables are not included in this repository for security reasons.
