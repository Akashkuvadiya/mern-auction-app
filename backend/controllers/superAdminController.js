import mongoose from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { commission } from "../models/commissionSchema.js";
import { User } from "../models/userSchema.js";
import { Auction } from "../models/auctionSchema.js";
import { PaymentProof } from "../models/commissionProofSchema.js";
import Transaction from "../models/transactionSchema.js";

export const deleteAuctionItems = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction  not found", 404));
  }
  await auctionItem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Auction item deleted successfully.",
  });
});

export const getAllPaymentProofs = catchAsyncErrors(async (req, res, next) => {
  let paymentProofs = await PaymentProof.find();
  res.status(200).json({
    success: true,
    paymentProofs,
  });
});

export const getPaymentProofDetail = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const paymentProofDetail = await PaymentProof.findById(id);
    res.status(200).json({
      success: true,
      paymentProofDetail,
    });
  }
);

export const updateProofStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { amount, status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  let proof = await PaymentProof.findById(id);
  if (!proof) {
    return next(new ErrorHandler("Payment proof not found.", 400));
  }
  proof = await PaymentProof.findByIdAndUpdate(
    id,
    { status, amount },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Payment proof amount and status updated.",
    proof,
  });
});

export const deletePaymentProof = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const proof = await PaymentProof.findById(id);
  if (!proof) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }
  await proof.deleteOne();
  res.status(200).json({
    success: true,
    message: "Payment proof deleted.",
  });
});

export const fetchAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          role: "$role",
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        month: "$_id.month",
        year: "$_id.year",
        role: "$_id.role",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);

  const bidders = users.filter((user) => user.role === "Bidder");
  const auctioneers = users.filter((user) => user.role === "Auctioneer");

  const tranformDataToMonthlyArray = (data, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);

    data.forEach((item) => {
      result[item.month - 1] = item.count;
    });

    return result;
  };

  const biddersArray = tranformDataToMonthlyArray(bidders);
  const auctioneersArray = tranformDataToMonthlyArray(auctioneers);

  res.status(200).json({
    success: true,
    biddersArray,
    auctioneersArray,
  });
});

export const updateUserWalletBalance = catchAsyncErrors(
  async (req, res, next) => {
    const { userId } = req.params;
    const { amount, action, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new ErrorHandler("Invalid user ID format", 400));
    }

    if (!amount || amount <= 0) {
      return next(new ErrorHandler("Please provide a valid amount", 400));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    let newBalance = user.wallet.balance;

    if (action === "add") {
      newBalance += Number(amount);
    } else if (action === "subtract") {
      if (user.wallet.balance < amount) {
        return next(new ErrorHandler("Insufficient wallet balance", 400));
      }
      newBalance -= Number(amount);
    } else {
      return next(
        new ErrorHandler("Invalid action. Use 'add' or 'subtract'", 400)
      );
    }

    user.wallet.balance = newBalance;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User wallet balance ${
        action === "add" ? "increased" : "decreased"
      } by $ ${amount}`,
      currentBalance: user.wallet.balance,
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  }
);

export const monthlyRevenue = catchAsyncErrors(async (req, res, next) => {
  // Get commission data first
  const payments = await commission.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $unwind: "$userDetails"
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          role: "$userDetails.role"
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  // Get transaction data
  const transactions = await Transaction.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        totalTransactionAmount: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    }
  ]);

  // Get payment proof data
  const paymentProofs = await PaymentProof.aggregate([
    {
      $match: {
        status: { $in: ["Approved", "Settled"] }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: "$uploadedAt" },
          year: { $year: "$uploadedAt" },
        },
        totalProofAmount: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    }
  ]);

  // Separate data by role
  const bidderPayments = payments.filter(payment => payment._id.role === "Bidder");
  const auctioneerPayments = payments.filter(payment => payment._id.role === "Auctioneer");
  
  // Transform data for each role
  const tranformDataToMonthlyArray = (payments, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);
    
    payments.forEach((payment) => {
      result[payment._id.month - 1] += payment.totalAmount;
    });

    return result;
  };

  // Transform transaction data
  const transformTransactionData = (transactions, totalMonths = 12) => {
    const amounts = Array(totalMonths).fill(0);
    const counts = Array(totalMonths).fill(0);
    
    transactions.forEach((tx) => {
      amounts[tx._id.month - 1] += tx.totalTransactionAmount;
      counts[tx._id.month - 1] += tx.count;
    });

    return { amounts, counts };
  };

  // Transform payment proof data
  const transformPaymentProofData = (proofs, totalMonths = 12) => {
    const amounts = Array(totalMonths).fill(0);
    const counts = Array(totalMonths).fill(0);
    
    proofs.forEach((proof) => {
      amounts[proof._id.month - 1] += proof.totalProofAmount;
      counts[proof._id.month - 1] += proof.count;
    });

    return { amounts, counts };
  };

  const totalMonthlyRevenue = tranformDataToMonthlyArray(payments);
  const bidderMonthlyPayments = tranformDataToMonthlyArray(bidderPayments);
  const auctioneerMonthlyPayments = tranformDataToMonthlyArray(auctioneerPayments);
  
  const { amounts: monthlyTransactionAmounts, counts: monthlyTransactionCounts } = 
    transformTransactionData(transactions);
  
  const { amounts: monthlyPaymentProofAmounts, counts: monthlyPaymentProofCounts } = 
    transformPaymentProofData(paymentProofs);

  res.status(200).json({
    success: true,
    totalMonthlyRevenue,
    bidderMonthlyPayments,
    auctioneerMonthlyPayments,
    monthlyTransactionAmounts,
    monthlyTransactionCounts,
    monthlyPaymentProofAmounts,
    monthlyPaymentProofCounts
  });
});
