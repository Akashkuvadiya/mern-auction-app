import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import Transaction from "../models/transactionSchema.js";
import { User } from "../models/userSchema.js";
import { Auction } from "../models/auctionSchema.js";
import mongoose from "mongoose";

// Get commission statistics for admin dashboard
export const getCommissionStats = catchAsyncErrors(async (req, res, next) => {
  try {
    // Calculate total commission earned
    const transactions = await Transaction.find({
      status: { $in: ["Approved", "Settled"] },
    });

    let totalCommission = 0;
    let monthlyCommissions = {};

    // Process each transaction to calculate commissions and organize by month
    transactions.forEach((transaction) => {
      // Calculate commission if not present
      const commission =
        transaction.commission?.amount || transaction.amount * 0.05;
      totalCommission += commission;

      // Get month and year for monthly stats
      const date = transaction.updatedAt || transaction.createdAt;
      const monthYear = date.toISOString().substring(0, 7); // Format: YYYY-MM

      // Add to monthly commissions
      if (!monthlyCommissions[monthYear]) {
        monthlyCommissions[monthYear] = 0;
      }
      monthlyCommissions[monthYear] += commission;
    });

    // Convert monthly commissions to array format for charts
    const monthlyCommissionsArray = Object.entries(monthlyCommissions).map(
      ([month, amount]) => ({
        month,
        amount,
      })
    );

    // Sort by month
    monthlyCommissionsArray.sort((a, b) => a.month.localeCompare(b.month));

    res.status(200).json({
      success: true,
      totalCommission,
      monthlyCommissions: monthlyCommissionsArray,
      totalTransactions: transactions.length,
    });
  } catch (error) {
    console.error("Error in getCommissionStats:", error);
    return next(
      new ErrorHandler(
        error.message || "Failed to fetch commission statistics",
        500
      )
    );
  }
});

// Get payment statistics for admin dashboard
export const getPaymentStats = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get all transactions
    const transactions = await Transaction.find();

    // Calculate total payment volume
    const totalPaymentVolume = transactions.reduce(
      (sum, transaction) => sum + (transaction.amount || 0),
      0
    );

    // Calculate monthly payment volume
    let monthlyPayments = {};

    transactions.forEach((transaction) => {
      const date = transaction.createdAt;
      const monthYear = date.toISOString().substring(0, 7); // Format: YYYY-MM

      if (!monthlyPayments[monthYear]) {
        monthlyPayments[monthYear] = 0;
      }
      monthlyPayments[monthYear] += transaction.amount || 0;
    });

    // Convert to array format for charts
    const monthlyPaymentsArray = Object.entries(monthlyPayments).map(
      ([month, amount]) => ({
        month,
        amount,
      })
    );

    // Sort by month
    monthlyPaymentsArray.sort((a, b) => a.month.localeCompare(b.month));

    // Get payment status statistics
    const paymentStatusStats = await Transaction.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      totalPaymentVolume,
      totalTransactions: transactions.length,
      monthlyPayments: monthlyPaymentsArray,
      paymentStatusStats,
    });
  } catch (error) {
    console.error("Error in getPaymentStats:", error);
    return next(
      new ErrorHandler(
        error.message || "Failed to fetch payment statistics",
        500
      )
    );
  }
});

// Get combined dashboard statistics
export const getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get total user counts
    const totalUsers = await User.countDocuments();
    const totalAuctioneers = await User.countDocuments({ role: "Auctioneer" });
    const totalBidders = await User.countDocuments({ role: "Bidder" });

    // Get auction statistics
    const totalAuctions = await Auction.countDocuments();
    const activeAuctions = await Auction.countDocuments({
      startTime: { $lte: new Date().toISOString() },
      endTime: { $gt: new Date().toISOString() },
    });
    const completedAuctions = await Auction.countDocuments({
      endTime: { $lte: new Date().toISOString() },
    });

    // Get transaction statistics
    const transactions = await Transaction.find();
    const totalTransactionVolume = transactions.reduce(
      (sum, transaction) => sum + (transaction.amount || 0),
      0
    );

    // Calculate commission
    const successfulTransactions = transactions.filter(
      (t) => t.status === "Approved" || t.status === "Settled"
    );
    const totalCommission = successfulTransactions.reduce(
      (sum, transaction) => {
        const commission =
          transaction.commission?.amount || transaction.amount * 0.05;
        return sum + commission;
      },
      0
    );

    // Get monthly data for graphs
    let monthlyData = {};

    transactions.forEach((transaction) => {
      const date = transaction.createdAt;
      const monthYear = date.toISOString().substring(0, 7); // Format: YYYY-MM

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          transactions: 0,
          volume: 0,
          commission: 0,
        };
      }

      monthlyData[monthYear].transactions += 1;
      monthlyData[monthYear].volume += transaction.amount || 0;

      if (
        transaction.status === "Approved" ||
        transaction.status === "Settled"
      ) {
        const commission =
          transaction.commission?.amount || transaction.amount * 0.05;
        monthlyData[monthYear].commission += commission;
      }
    });

    // Convert to array format for charts
    const monthlyDataArray = Object.entries(monthlyData).map(
      ([month, data]) => ({
        month,
        ...data,
      })
    );

    // Sort by month
    monthlyDataArray.sort((a, b) => a.month.localeCompare(b.month));

    res.status(200).json({
      success: true,
      userStats: {
        totalUsers,
        totalAuctioneers,
        totalBidders,
      },
      auctionStats: {
        totalAuctions,
        activeAuctions,
        completedAuctions,
      },
      transactionStats: {
        totalTransactions: transactions.length,
        totalVolume: totalTransactionVolume,
        totalCommission,
      },
      monthlyData: monthlyDataArray,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return next(
      new ErrorHandler(
        error.message || "Failed to fetch dashboard statistics",
        500
      )
    );
  }
});
