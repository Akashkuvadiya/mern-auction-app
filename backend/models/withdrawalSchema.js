import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Completed", "Failed"],
            default: "Pending",
        },
        transferMethod: {
            type: String,
            enum: ["BankTransfer", "RazorpayTransfer", "PayPalTransfer"],
            required: true,
        },
        transferDetails: {
            bankTransfer: {
                accountNumber: String,
                accountName: String,
                bankName: String,
                ifscCode: String,
            },
            razorpayTransfer: {
                accountId: String,
                contactId: String,
                fundAccountId: String,
                razorpayPayoutId: String,
            },
            paypalTransfer: {
                email: String,
                transactionId: String,
            },
        },
        remarks: String,
    },
    { timestamps: true }
);

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
export default Withdrawal; 