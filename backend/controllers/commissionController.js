import mongoose from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { PaymentProof } from "../models/commissionProofSchema.js";
import { User } from "../models/userSchema.js"
import { v2 as cloudinary } from "cloudinary";

export const calculateCommission = async (auctionId) => {
    const auction = await Auction.findById(auctionId);
    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
        return next(new ErrorHandler("Invalid Auction Id format.", 400));
    }
    const commissionRate = 0.05;
    const commission = auction.currentBid * commissionRate;
    return commission;
};

export const proofOfCommission = catchAsyncErrors(async (req, res, next) => {
    // Ensure file is uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Payment Proof Screenshot required.", 400));
    }

    const { proof } = req.files;
    let { amount, comment } = req.body;

    // Convert amount to a number (in case it's sent as a string)
    amount = parseFloat(amount);

    // Validate amount and comment
    if (!amount || isNaN(amount) || !comment || comment.trim() === "") {
        return next(new ErrorHandler("Amount & comment are required fields.", 400));
    }

    // Fetch user
    const user = await User.findById(req.user._id);

    // Check unpaid commission
    if (user.unpaidCommission === 0) {
        return res.status(200).json({
            success: true,
            message: "You don't have any unpaid commissions.",
        });
    }

    if (user.unpaidCommission < amount) {
        return next(
            new ErrorHandler(
                `The amount exceeds your unpaid commission balance. Please enter an amount up to ${user.unpaidCommission}`,
                403
            )
        );
    }

    // Validate file format
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(proof.mimetype)) {
        return next(new ErrorHandler("Screenshot format not supported.", 400));
    }

    // Upload proof to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(proof.tempFilePath, {
        folder: "MERN_AUCTION_PLATEFORM_PAYMENT_PROOFS",
    });

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Failed to upload payment proof to Cloudinary.", 500));
    }

    // Save proof to database
    const commissionProof = await PaymentProof.create({
        userId: req.user._id,
        proof: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
        amount,
        comment,
    });

    res.status(201).json({
        success: true,
        message: "Your proof has been submitted successfully. We will review it and respond to you within 24 hours.",
        commissionProof,
    });
});
