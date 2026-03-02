// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        auction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
            required: true,
        },
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        auctioneer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        commission: {
            rate: {
                type: Number,
                default: 0.05, // 5% by default
            },
            amount: {
                type: Number,
                default: function() {
                    return this.amount * this.commission.rate;
                }
            }
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Approved", "Settled", "Failed", "Refunded"],
            default: "Pending",
        },
        paymentReference: {
            type: String, // Razorpay Order ID
        },
        razorpayPaymentId: {
            type: String,
        },
        razorpaySignature: {
            type: String,
        },
        paymentLink: { 
            type: String 
        },
        paymentMethod: {
            type: String,
            enum: ["RazorPay", "PayPal", "BankTransfer"],
            default: "RazorPay",
        },
        transferredToAuctioneer: {
            status: {
                type: Boolean,
                default: false,
            },
            transferDate: Date,
        },
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
