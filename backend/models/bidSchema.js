import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    amount: Number,
    bidder: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            require: true
        },
        userName: String,
        profileImage: String,
    },
    auctionItem: {
        type: mongoose.Schema.ObjectId,
        ref: "Auction",
        require: true,
    },
});

export const Bid = mongoose.model("Bid", bidSchema);