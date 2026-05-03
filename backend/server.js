import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import cloudinary from "cloudinary";

// Load env variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    dbName: "MERN_AUCTION_PLATFORM",
})
.then(() => {
    console.log("MongoDB Connected Successfully ✅");

    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("DB Error ❌:", err);
});

// Cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});