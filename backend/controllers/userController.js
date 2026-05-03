import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

export const register = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Profile Image Required.", 400));
    }

    const { profileImage } = req.files;

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(profileImage.mimetype)) {
        return next(new ErrorHandler("File format not supported.", 400));
    }

    const {
        userName,
        password,
        email,
        address,
        phone,
        role,
        bankAccountNumber,
        bankAccountName,
        bankName,
        razorpayAccountNumber,
        paypalEmail,
    } = req.body;

    if (!userName || !email || !phone || !password || !address || !role) {
        return next(new ErrorHandler("Please fill full form.", 400));
    }

    if (role === "Auctioneer") {
        if (!bankAccountName || !bankAccountNumber || !bankName) {
            return next(new ErrorHandler("Please provide your bank details.", 400));
        }
        if (!razorpayAccountNumber) {
            return next(new ErrorHandler("Please provide your Razorpay account number.", 400));
        }
        if (!paypalEmail) {
            return next(new ErrorHandler("Please provide your PayPal email.", 400));
        }
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler("User already registered.", 400));
    }

    try {
        const cloudinaryResponse = await cloudinary.uploader.upload(profileImage.tempFilePath, {
            folder: "MERN_AUCTION_PLATEFORM_USER",
        });

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(new ErrorHandler("Failed to upload profile image to Cloudinary.", 500));
        }


        const user = await User.create({
            userName,
            password,
            email,
            address,
            phone,
            role,
            profileImage: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            },
            paymentMethods: {
                bankTransfer: {
                    bankAccountNumber,
                    bankAccountName,
                    bankName,
                },
                razorpay: {
                    razorpayAccountNumber,
                },
                paypal: {
                    paypalEmail,
                },
            },
        });
        generateToken(user, "User Registered", 201, res);


    } catch (error) {
         console.error("REAL ERROR:", error);
        return next(new ErrorHandler("Failed to upload profile image to Cloudinary.", 500));
    }
});


export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please fill full form."));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid credentials.", 400));
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid credentials.", 400));
    }
    generateToken(user, "Login Successfully.", 200, res);
});

export const getProfile = catchAsyncErrors(async (req, res, next) => {
    console.log("getProfile called");
    
    // Get the complete user with all fields
    const userId = req.user._id;
    const completeUser = await User.findById(userId);
    
    if (!completeUser) {
        return next(new ErrorHandler("User not found", 404));
    }
    
    console.log("User details:", {
        id: completeUser._id,
        userName: completeUser.userName,
        role: completeUser.role,
        hasPaymentMethods: !!completeUser.paymentMethods
    });
    
    res.status(200).json({
        success: true,
        user: completeUser
    });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        // expires: new Date(0),
        httpOnly: true
    }).json({
        success: true,
        message: "Logout Successfully",
    });
});

export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
    // Only include bidders with spending history
    const users = await User.find({ 
        role: "Bidder", 
        moneySpent: { $gt: 0 } 
    }).select('userName profileImage moneySpent auctionWon');
    
    // Add debug logging
    console.log(`Fetched ${users.length} users for leaderboard`);
    if (users.length > 0) {
        console.log(`Sample user: ${users[0].userName}, Money spent: ${users[0].moneySpent}, Auctions won: ${users[0].auctionWon}`);
    }
    
    // Sort by money spent in descending order
    const leaderboard = users.sort((a, b) => b.moneySpent - a.moneySpent);
    
    res.status(200).json({
        success: true,
        leaderboard,
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new ErrorHandler("Please provide your email.", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    const message = `You are receiving this email because you (or someone else) has requested to reset the password for your account.\n\n
    Please click on the following link to reset your password:\n\n
    ${resetUrl}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n\n
    This link will expire in 15 minutes.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message,
        });

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email.",
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(new ErrorHandler("Email could not be sent.", 500));
    }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        return next(new ErrorHandler("Please provide a new password.", 400));
    }

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Invalid or expired reset token.", 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successfully.",
    });
});

export const validateResetToken = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.params;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired reset token",
        });
    }

    res.status(200).json({
        success: true,
        message: "Valid reset token",
    });
});
