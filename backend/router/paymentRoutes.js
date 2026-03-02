// routes/paymentRoutes.js
import express from "express";
import {
    createPaymentLink,
    getPaymentInfo,
    verifyPayment,
    settlePayment,
    withdrawFunds,
    processWithdrawal,
    getWalletDetails,
    getAllTransactions,
    getAllWithdrawals,
    createAuctionPayment
} from "../controllers/paymentController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

// Create payment for auction winner (by the winner themselves)
router.post("/create/:auctionId", isAuthenticated, isAuthorized("Bidder"), createAuctionPayment);

// Create payment link for auction winner
router.post("/create-payment-link/:auctionId", isAuthenticated, isAuthorized("Super Admin"), createPaymentLink);

// Get payment information for checkout page
router.get("/payment-info/:transactionId", isAuthenticated, getPaymentInfo);

// Verify & process payment after Razorpay callback
router.post("/verify/:transactionId", verifyPayment);

// Admin settles payment (transfers to auctioneer's wallet)
router.post("/settle/:transactionId", isAuthenticated, isAuthorized("Super Admin"), settlePayment);

// Auctioneer/User withdraws funds from wallet to bank account
router.post("/withdraw", isAuthenticated, isAuthorized("Auctioneer"), withdrawFunds);

// Admin processes withdrawal request
router.post("/process-withdrawal/:withdrawalId", isAuthenticated, isAuthorized("Super Admin"), processWithdrawal);

// Get wallet details and transaction history
router.get("/wallet", isAuthenticated, getWalletDetails);

// Admin routes
router.get("/transactions", isAuthenticated, isAuthorized("Super Admin"), getAllTransactions);
router.get("/withdrawals", isAuthenticated, isAuthorized("Super Admin"), getAllWithdrawals);

export default router;
