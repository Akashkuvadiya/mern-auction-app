import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        minLength: [3, "Username must caontain at least 3 characters."],
        maxLength: [40, "Username cannot exceed 40 characters."],
    },
    password: {
        type: String,
        selected: false,
        minLength: [8, "Password must caontain at least 8 characters."],

    },
    email: String,
    address: String,
    phone: {
        type: String,
        minLength: [10, "Phone must caontain exact 10 digits."],
        maxLength: [10, "Phone must caontain exact 10 digits"],
    },
    profileImage: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    paymentMethods: {
        bankTransfer: {
            bankAccountNumber: String,
            bankAccountName: String,
            bankName: String,
            ifscCode: String,
            accountType: String,
        },
        razorpay: {
            razorpayAccountNumber: String,
            razorpayContactId: String,
            razorpayFundAccountId: String,
        },
        paypal: {
            paypalEmail: String,
        },
    },
    role: {
        type: String,
        enum: ["Auctioneer", "Bidder", "Super Admin"],
    },
    unpaidCommission: {
        type: Number,
        default: 0
    },
    wallet: {
        balance: {
            type: Number,
            default: 0
        },
        transactions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }],
        pendingWithdrawals: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Withdrawal"
        }]
    },
    auctionWon: {
        type: Number,
        default: 0
    },
    moneySpent: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (entredPassword) {
    return await bcrypt.compare(entredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const User = mongoose.model("User", userSchema);