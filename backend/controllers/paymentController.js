import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import crypto from "crypto";
import Transaction from "../models/transactionSchema.js";
import { User } from "../models/userSchema.js";
import { Auction } from "../models/auctionSchema.js";
import Withdrawal from "../models/withdrawalSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  paymentSuccessEmail,
  auctioneerPaymentEmail,
  adminPaymentEmail,
  withdrawalRequestEmail,
  withdrawalStatusEmail,
} from "../utils/emailTemplates.js";

// Initialize Razorpay with error handling
let razorpayInstance;
try {
    // Make sure we have valid API keys
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_us_SKdQRPcEgu0Rvd";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "uV4RbmbbB8y9z4Ak3KtbTfBN";
    
    if (!key_id || !key_secret) {
        throw new Error("Missing Razorpay API keys");
    }
    
    razorpayInstance = new Razorpay({
        key_id: key_id,
        key_secret: key_secret
    });
    console.log("Razorpay initialized successfully with key:", key_id);
} catch (error) {
    console.error("Failed to initialize Razorpay:", error);
}

// Helper function to check if Razorpay is ready
const isRazorpayReady = () => {
    if (!razorpayInstance) {
        console.error("Razorpay instance is not initialized");
        throw new Error("Payment gateway not initialized. Please try again later.");
    }
    return true;
};

// 1. Create Payment Link for Auction Winner
export const createPaymentLink = asyncHandler(async (req, res) => {
    const { auctionId } = req.params;
    
    const auction = await Auction.findById(auctionId).populate('winner createdBy');
    if (!auction) {
        res.status(404);
        throw new Error("Auction not found");
    }
    
    if (!auction.winner) {
        res.status(400);
        throw new Error("No winner declared for this auction");
    }
    
    // Check if a transaction already exists for this auction
    const existingTransaction = await Transaction.findOne({ auction: auctionId });
    if (existingTransaction) {
        return res.status(200).json({
            success: true,
            message: "Payment link already exists",
            paymentLink: existingTransaction.paymentLink,
            transaction: existingTransaction
        });
    }

    const bidderId = auction.winner._id;
    const auctioneerId = auction.createdBy._id;
    const amount = auction.finalBidAmount;
    //const razorpayAmount = Math.round(amount * 100); // Convert to paise and round
    const razorpayAmount = Math.round(amount); // for USD, no need to multiply by 100

    // Create razorpay order
    const options = {
        amount: razorpayAmount,
        currency: "USD",
        receipt: `receipt_${auctionId}_${Date.now()}`,
        payment_capture: 1,
    };
    
    const order = await razorpayInstance.orders.create(options);
    
    // Create transaction record
    const transaction = await Transaction.create({
        auction: auctionId,
        bidder: bidderId,
        auctioneer: auctioneerId,
        amount,
        status: "Pending",
        paymentReference: order.id,
    });
    
    // Generate payment link
    const paymentLink = `http://localhost:5173/payment/${transaction._id}`;
    transaction.paymentLink = paymentLink;
    await transaction.save();
    
    // Send email to bidder
    const bidder = auction.winner;
    const emailSubject = `Payment Link for Auction Item: ${auction.itemName}`;
    const emailMessage = `Dear ${bidder.userName},

Congratulations on winning the auction for ${auction.itemName}!

Please complete your payment using the link below:
${paymentLink}

Amount to pay: $ ${amount}
Order ID: ${order.id}

This payment link will be valid for 48 hours.

Thank you,
Auction Team`;

    await sendEmail({ 
        email: bidder.email, 
        subject: emailSubject, 
        message: emailMessage 
    });
    
    res.status(201).json({
        success: true,
        message: "Payment link created and sent to bidder",
        transaction,
        paymentLink
    });
});

// 2. Get Payment Information for Checkout Page
export const getPaymentInfo = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;
    
    try {
        isRazorpayReady();
        
        const transaction = await Transaction.findById(transactionId)
            .populate('auction bidder auctioneer');
        
        if (!transaction) {
            res.status(404);
            throw new Error("Transaction not found");
        }
        
        // Get item name, handling different field names in auction
        const itemName = transaction.auction.title || transaction.auction.itemName || 'Auction Item';
        
        // Get image URL, handling different field structures
        let imageUrl = null;
        if (transaction.auction.image && transaction.auction.image.url) {
            imageUrl = transaction.auction.image.url;
        } else if (transaction.auction.images && transaction.auction.images.length > 0) {
            imageUrl = transaction.auction.images[0].url;
        }
        
        // Get bidder info safely
        const bidderName = transaction.bidder ? transaction.bidder.userName : '';
        const bidderEmail = transaction.bidder ? transaction.bidder.email : '';
        const bidderPhone = transaction.bidder ? transaction.bidder.phone : '';
        
        res.status(200).json({
            success: true,
            transaction,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_us_SKdQRPcEgu0Rvd",
            orderId: transaction.paymentReference,
            amount: transaction.amount,
            currency: "USD",
            name: itemName,
            description: `Payment for auction item: ${itemName}`,
            image: imageUrl,
            prefillInfo: {
                name: bidderName,
                email: bidderEmail,
                contact: bidderPhone
            }
        });
    } catch (error) {
        console.error("Error in getPaymentInfo:", error);
        if (!res.statusCode || res.statusCode === 200) {
            res.status(500);
        }
        throw error;
    }
});

// 3. Verify & Process Payment
export const verifyPayment = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    try {
        isRazorpayReady();
        
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            res.status(400);
            throw new Error("Missing required payment verification parameters");
        }
        
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            res.status(404);
            throw new Error("Transaction not found");
        }
        
        if (transaction.paymentReference !== razorpay_order_id) {
            res.status(400);
            throw new Error("Invalid order ID");
        }
        
        // Verify signature
        //const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "uV4RbmbbB8y9z4Ak3KtbTfBN");
        console.log("ORDER ID:", razorpay_order_id);
        console.log("PAYMENT ID:", razorpay_payment_id);
        console.log("SIGNATURE:", razorpay_signature);
        console.log("SECRET BEING USED:", process.env.RAZORPAY_KEY_SECRET);
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "uV4RbmbbB8y9z4Ak3KtbTfBN");
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest("hex");
        
        if (generatedSignature !== razorpay_signature) {
            transaction.status = "Failed";
            await transaction.save();
            
            res.status(400);
            throw new Error("Payment verification failed: Signature mismatch");
        }
        
        // Payment verified - update transaction
        transaction.status = "Approved";
        transaction.razorpayPaymentId = razorpay_payment_id;
        transaction.razorpaySignature = razorpay_signature;
        await transaction.save();
        
        console.log("Payment verified successfully:", razorpay_payment_id);
        
        // Update bidder spent amount
        const bidder = await User.findById(transaction.bidder);
        bidder.moneySpent = (bidder.moneySpent || 0) + transaction.amount;
        bidder.auctionWon = (bidder.auctionWon || 0) + 1;
        await bidder.save();
        
        // Calculate commission (5% of the transaction amount)
        const commissionRate = 0.05;
        const commissionAmount = transaction.amount * commissionRate;
        const netAmount = transaction.amount - commissionAmount;
        
        // Update transaction with commission info
        transaction.commission = {
            rate: commissionRate,
            amount: commissionAmount
        };
        await transaction.save();
        
        // Transfer the net amount to auctioneer's wallet
        const auctioneer = await User.findById(transaction.auctioneer);
        if (auctioneer) {
            // Initialize the wallet if it doesn't exist
            if (!auctioneer.wallet) {
                auctioneer.wallet = { balance: 0, transactions: [], pendingWithdrawals: [] };
            }
            
            // Add the net amount to the auctioneer's wallet
            auctioneer.wallet.balance = (auctioneer.wallet.balance || 0) + netAmount;
            
            // Add the transaction to the wallet history
            if (!auctioneer.wallet.transactions) {
                auctioneer.wallet.transactions = [];
            }
            auctioneer.wallet.transactions.push(transaction._id);
            
            // Save the changes
            await auctioneer.save();
            
            // Mark the transaction as settled
            transaction.status = "Settled";
            transaction.transferredToAuctioneer = {
                status: true,
                transferDate: new Date()
            };
            await transaction.save();
            
            console.log(`Transferred ${netAmount} to auctioneer's wallet. Commission: ${commissionAmount}`);
        }
        
        // Send confirmation emails
        const auction = await Auction.findById(transaction.auction);
        
        // Email to bidder
        const bidderEmailSubject = "Payment Successful - Auction Item Purchase";
        const bidderEmailMessage = `Dear ${bidder.userName},

Your payment of $ ${transaction.amount} for the auction item "${auction.title}" has been successfully processed.

Transaction Details:
- Payment ID: ${razorpay_payment_id}
- Order ID: ${razorpay_order_id}
- Amount: $ ${transaction.amount}

Thank you for your purchase!
Auction Team`;

        await sendEmail({
            email: bidder.email,
            subject: bidderEmailSubject,
            message: bidderEmailMessage,
            html: paymentSuccessEmail({
                bidderName: bidder.userName,
                auctionTitle: auction.title,
                amount: transaction.amount,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
            }),
        });

        // Email to Auctioneer
        if (auctioneer) {
            const auctioneerEmailSubject = "Payment Received - Auction Item Sale";
            const auctioneerEmailMessage = `Dear ${auctioneer.userName},

Good news! The payment for your auctioned item "${auction.title}" has been successfully processed and credited to your wallet.

Transaction Details:
- Auction Item: ${auction.title}
- Selling Price: $ ${transaction.amount}
- Commission (${commissionRate * 100}%): $ ${commissionAmount}
- Amount Credited to Your Wallet: $ ${netAmount}
- Current Wallet Balance: $ ${auctioneer.wallet.balance}

You can withdraw this amount at any time from your wallet.

Thank you for using our platform!
Auction Team`;

            await sendEmail({
                email: auctioneer.email,
                subject: auctioneerEmailSubject,
                message: auctioneerEmailMessage,
                html: auctioneerPaymentEmail({
                    auctioneerName: auctioneer.userName,
                    auctionTitle: auction.title,
                    amount: transaction.amount,
                    commissionRate,
                    commissionAmount,
                    netAmount,
                    walletBalance: auctioneer.wallet.balance,
                }),
            });
        }
        
        // Email to Super Admin
        const adminEmails = await User.find({ role: "Super Admin" }).select('email');
        
        if (adminEmails.length > 0) {
            const adminEmailSubject = `New Payment Received: ${auction.title}`;
            const adminEmailMessage = `A new payment has been received, verified, and settled automatically.

Transaction Details:
- Auction: ${auction.title}
- Bidder: ${bidder.userName} (${bidder.email})
- Auctioneer: ${auctioneer?.userName} (${auctioneer?.email})
- Total Amount: $ ${transaction.amount}
- Commission (${commissionRate * 100}%): $ ${commissionAmount}
- Amount Credited to Auctioneer: $ ${netAmount}
- Payment ID: ${razorpay_payment_id}

The funds have been automatically settled to the auctioneer's wallet.

Auction System`;

            for (const admin of adminEmails) {
                await sendEmail({
                    email: admin.email,
                    subject: adminEmailSubject,
                    message: adminEmailMessage,
                    html: adminPaymentEmail({
                        auctionTitle: auction.title,
                        bidderName: bidder.userName,
                        bidderEmail: bidder.email,
                        auctioneerName: auctioneer?.userName,
                        auctioneerEmail: auctioneer?.email,
                        amount: transaction.amount,
                        commissionRate,
                        commissionAmount,
                        netAmount,
                        paymentId: razorpay_payment_id,
                    }),
                });
            }
        }
        
        res.status(200).json({
            success: true,
            message: "Payment verified and settled successfully",
            transaction
        });
    } catch (error) {
        console.error("Error in verifyPayment:", error);
        if (!res.statusCode || res.statusCode === 200) {
            res.status(500);
        }
        throw error;
    }
});

// 4. Settle Payment (Transfer to Auctioneer Wallet) - Super Admin Only
export const settlePayment = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;
    
    const transaction = await Transaction.findById(transactionId)
        .populate('auctioneer bidder auction');
    
    if (!transaction) {
        res.status(404);
        throw new Error("Transaction not found");
    }
    
    if (transaction.status !== "Approved") {
        res.status(400);
        throw new Error("Transaction is not approved for settlement");
    }
    
    if (transaction.transferredToAuctioneer.status) {
        res.status(400);
        throw new Error("Transaction has already been settled");
    }
    
    // Calculate commission
    const commissionRate = transaction.commission.rate;
    const commissionAmount = transaction.amount * commissionRate;
    const netAmount = transaction.amount - commissionAmount;
    
    // Update auctioneer wallet
    const auctioneer = await User.findById(transaction.auctioneer._id);
    
    if (!auctioneer) {
        res.status(404);
        throw new Error("Auctioneer not found");
    }
    
    // Update wallet balance
    auctioneer.wallet.balance = (auctioneer.wallet.balance || 0) + netAmount;
    auctioneer.wallet.transactions.push(transaction._id);
    await auctioneer.save();
    
    // Update transaction
    transaction.status = "Settled";
    transaction.transferredToAuctioneer = {
        status: true,
        transferDate: new Date()
    };
    transaction.commission.amount = commissionAmount;
    await transaction.save();
    
    // Send email to auctioneer
    const auctioneerEmailSubject = "Payment Received in Your Wallet";
    const auctioneerEmailMessage = `Dear ${auctioneer.userName},

Great news! The payment for your auctioned item "${transaction.auction.itemName}" has been settled to your wallet.

Transaction Details:
- Auction Item: ${transaction.auction.itemName}
- Winning Bid: $ ${transaction.amount}
- Commission (${commissionRate * 100}%): $ ${commissionAmount}
- Net Amount Credited: $ ${netAmount}
- Current Wallet Balance: $ ${auctioneer.wallet.balance}

You can withdraw this amount to your bank account from your wallet dashboard.

Thank you for using our platform!
Auction Team`;

    await sendEmail({
        email: auctioneer.email,
        subject: auctioneerEmailSubject,
        message: auctioneerEmailMessage,
        html: auctioneerPaymentEmail({
            auctioneerName: auctioneer.userName,
            auctionTitle: transaction.auction.itemName,
            amount: transaction.amount,
            commissionRate,
            commissionAmount,
            netAmount,
            walletBalance: auctioneer.wallet.balance,
        }),
    });
    
    res.status(200).json({
        success: true,
        message: "Payment settled successfully",
        transaction,
        netAmount,
        commissionAmount,
        auctioneerWalletBalance: auctioneer.wallet.balance
    });
});

// 5. Withdraw Funds from Wallet
export const withdrawFunds = asyncHandler(async (req, res) => {
    const { amount, transferMethod } = req.body;
    const userId = req.user._id;
    
    // Validate input
    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error("Please enter a valid withdrawal amount");
    }
    
    if (!transferMethod) {
        res.status(400);
        throw new Error("Please select a transfer method");
    }
    
    // Get user and check wallet balance
    const user = await User.findById(userId);
    
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    
    if (user.wallet.balance < amount) {
        res.status(400);
        throw new Error(`Insufficient wallet balance. Available: $ ${user.wallet.balance}`);
    }
    
    let transferDetails = {};
    
    // Setup transfer details based on method
    if (transferMethod === "BankTransfer") {
        if (!user.paymentMethods.bankTransfer.bankAccountNumber) {
            res.status(400);
            throw new Error("Please add your bank account details before withdrawal");
        }
        
        transferDetails.bankTransfer = {
            accountNumber: user.paymentMethods.bankTransfer.bankAccountNumber,
            accountName: user.paymentMethods.bankTransfer.bankAccountName,
            bankName: user.paymentMethods.bankTransfer.bankName,
            ifscCode: user.paymentMethods.bankTransfer.ifscCode
        };
    } else if (transferMethod === "RazorpayTransfer") {
        if (!user.paymentMethods.razorpay.razorpayAccountNumber) {
            res.status(400);
            throw new Error("Please add your Razorpay account details before withdrawal");
        }
        
        transferDetails.razorpayTransfer = {
            accountId: user.paymentMethods.razorpay.razorpayAccountNumber,
            contactId: user.paymentMethods.razorpay.razorpayContactId,
            fundAccountId: user.paymentMethods.razorpay.razorpayFundAccountId
        };
    } else if (transferMethod === "PayPalTransfer") {
        if (!user.paymentMethods.paypal.paypalEmail) {
            res.status(400);
            throw new Error("Please add your PayPal details before withdrawal");
        }
        
        transferDetails.paypalTransfer = {
            email: user.paymentMethods.paypal.paypalEmail
        };
    }
    
    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
        user: userId,
        amount,
        transferMethod,
        transferDetails,
        status: "Pending"
    });
    
    // Deduct from wallet balance
    user.wallet.balance -= amount;
    user.wallet.pendingWithdrawals.push(withdrawal._id);
    await user.save();
    
    // Notify admin of withdrawal request
    const adminEmails = await User.find({ role: "Super Admin" }).select('email');
    
    if (adminEmails.length > 0) {
        const adminEmailSubject = `New Withdrawal Request: $ ${amount}`;
        const adminEmailMessage = `A new withdrawal request has been received.

Withdrawal Details:
- User: ${user.userName} (${user.email})
- Amount: $ ${amount}
- Transfer Method: ${transferMethod}
- Request ID: ${withdrawal._id}

Please process this request in the admin dashboard.

Auction System`;

        for (const admin of adminEmails) {
            await sendEmail({
                email: admin.email,
                subject: adminEmailSubject,
                message: adminEmailMessage,
                html: withdrawalRequestEmail({
                    userName: user.userName,
                    userEmail: user.email,
                    amount,
                    transferMethod,
                    withdrawalId: withdrawal._id,
                }),
            });
        }
    }
    
    res.status(201).json({
        success: true,
        message: "Withdrawal request submitted successfully",
        withdrawal,
        walletBalance: user.wallet.balance
    });
});

// 6. Process Withdrawal (Admin)
export const processWithdrawal = asyncHandler(async (req, res) => {
    const { withdrawalId } = req.params;
    const { status, remarks, razorpayPayoutId } = req.body;
    
    const withdrawal = await Withdrawal.findById(withdrawalId).populate('user');
    
    if (!withdrawal) {
        res.status(404);
        throw new Error("Withdrawal request not found");
    }
    
    if (withdrawal.status === "Completed" || withdrawal.status === "Failed") {
        res.status(400);
        throw new Error(`Withdrawal has already been ${withdrawal.status.toLowerCase()}`);
    }
    
    // Update withdrawal status
    withdrawal.status = status;
    withdrawal.remarks = remarks || "";
    
    // If using Razorpay, store the payout ID
    if (withdrawal.transferMethod === "RazorpayTransfer" && razorpayPayoutId) {
        withdrawal.transferDetails.razorpayTransfer.razorpayPayoutId = razorpayPayoutId;
    }
    
    await withdrawal.save();
    
    // If withdrawal failed, return funds to user's wallet
    if (status === "Failed") {
        const user = await User.findById(withdrawal.user._id);
        user.wallet.balance += withdrawal.amount;
        
        const withdrawalIndex = user.wallet.pendingWithdrawals.indexOf(withdrawalId);
        if (withdrawalIndex > -1) {
            user.wallet.pendingWithdrawals.splice(withdrawalIndex, 1);
        }
        
        await user.save();
    }
    
    // Send email notification to user
    const user = withdrawal.user;
    const emailSubject = `Withdrawal Request ${status}`;
    let emailMessage = `Dear ${user.userName},\n\n`;
    
    if (status === "Completed") {
        emailMessage += `Your withdrawal request for $ ${withdrawal.amount} has been processed successfully and the funds have been transferred to your ${withdrawal.transferMethod === "BankTransfer" ? "bank account" : withdrawal.transferMethod === "RazorpayTransfer" ? "Razorpay account" : "PayPal account"}.`;
    } else if (status === "Failed") {
        emailMessage += `Your withdrawal request for $ ${withdrawal.amount} could not be processed and has been canceled. The funds have been returned to your wallet.`;
    } else {
        emailMessage += `Your withdrawal request for $ ${withdrawal.amount} is now ${status.toLowerCase()}.`;
    }
    
    if (remarks) {
        emailMessage += `\n\nRemarks: ${remarks}`;
    }
    
    emailMessage += `\n\nIf you have any questions, please contact our support team.\n\nAuction Team`;
    
    await sendEmail({
        email: user.email,
        subject: emailSubject,
        message: emailMessage,
        html: withdrawalStatusEmail({
            userName: user.userName,
            amount: withdrawal.amount,
            status,
            transferMethod: withdrawal.transferMethod,
            remarks,
        }),
    });
    
    res.status(200).json({
        success: true,
        message: `Withdrawal request ${status.toLowerCase()} successfully`,
        withdrawal
    });
});

// 7. Get Wallet Details
export const getWalletDetails = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const user = await User.findById(userId)
        .populate({
            path: 'wallet.transactions',
            populate: {
                path: 'auction',
                select: 'itemName'
            }
        })
        .populate('wallet.pendingWithdrawals');
    
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    
    // Get completed withdrawals
    const completedWithdrawals = await Withdrawal.find({
        user: userId,
        status: { $in: ["Completed", "Failed"] }
    }).sort({ updatedAt: -1 });
    
    res.status(200).json({
        success: true,
        wallet: {
            balance: user.wallet.balance,
            transactions: user.wallet.transactions,
            pendingWithdrawals: user.wallet.pendingWithdrawals,
            completedWithdrawals
        }
    });
});

// 8. Get Transaction Details (Admin)
export const getAllTransactions = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) {
        query.status = status;
    }
    
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: [
            { path: 'bidder', select: 'userName email' },
            { path: 'auctioneer', select: 'userName email' },
            { path: 'auction', select: 'itemName' }
        ]
    };
    
    const transactions = await Transaction.find(query)
        .populate('bidder', 'userName email')
        .populate('auctioneer', 'userName email')
        .populate('auction', 'itemName')
        .limit(options.limit)
        .skip((options.page - 1) * options.limit)
        .sort(options.sort);
    
    const total = await Transaction.countDocuments(query);
    
    res.status(200).json({
        success: true,
        transactions,
        totalPages: Math.ceil(total / options.limit),
        currentPage: options.page,
        total
    });
});

// 9. Get All Withdrawals (Admin)
export const getAllWithdrawals = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) {
        query.status = status;
    }
    
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: { path: 'user', select: 'userName email' }
    };
    
    const withdrawals = await Withdrawal.find(query)
        .populate('user', 'userName email')
        .limit(options.limit)
        .skip((options.page - 1) * options.limit)
        .sort(options.sort);
    
    const total = await Withdrawal.countDocuments(query);
    
    res.status(200).json({
        success: true,
        withdrawals,
        totalPages: Math.ceil(total / options.limit),
        currentPage: options.page,
        total
    });
});

// 4. Create payment transaction for auction winner
export const createAuctionPayment = asyncHandler(async (req, res) => {
    const { auctionId } = req.params;
    
    try {
        // Check if Razorpay is initialized
        isRazorpayReady();
        
        // Find the auction and check if the current user is the winner
        const auction = await Auction.findById(auctionId).populate('createdBy highestBidder');
        
        if (!auction) {
            res.status(404);
            throw new Error("Auction not found");
        }
        
        console.log('Auction found:', auction.title || auction._id);
        console.log('Current user ID:', req.user._id);
        console.log('Highest bidder ID:', auction.highestBidder ? auction.highestBidder._id : 'No highest bidder');
        
        // Check if the user is the winner
        if (!auction.highestBidder || auction.highestBidder._id.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error("You are not authorized to make payment for this auction");
        }
        
        // Check if a transaction already exists
        const existingTransaction = await Transaction.findOne({ 
            auction: auctionId,
            bidder: req.user._id
        });
        
        if (existingTransaction) {
            return res.status(200).json({
                success: true,
                message: "Payment transaction already exists",
                transaction: existingTransaction
            });
        }
        
        // Create Razorpay order
        const amount = auction.currentBid;
        console.log('Creating order for amount:', amount);
        
        if (!amount || amount <= 0) {
            res.status(400);
            throw new Error("Invalid bid amount for payment");
        }
        
        //const razorpayAmount = Math.round(amount * 100); // Convert to paise
        const razorpayAmount = Math.round(amount); // for USD, no need to multiply by 100
        
        // Create a shorter receipt ID (max 40 chars as per Razorpay requirement)
        const shortAuctionId = auctionId.toString().substring(0, 10);
        const timestamp = Date.now().toString().substring(0, 10);
        const receipt = `rcpt_${shortAuctionId}_${timestamp}`;
        
        const orderOptions = {
            amount: razorpayAmount,
            currency: "USD",
            receipt: receipt,
            payment_capture: 1
        };
        
        console.log('Razorpay order options:', orderOptions);
        
        try {
            // Make sure Razorpay instance is available
            if (!razorpayInstance || !razorpayInstance.orders || !razorpayInstance.orders.create) {
                throw new Error("Razorpay is not properly initialized");
            }
            
            const order = await razorpayInstance.orders.create(orderOptions);
            
            if (!order || !order.id) {
                throw new Error("Failed to get valid order ID from Razorpay");
            }
            
            console.log('Razorpay order created:', order.id);
            
            // Create transaction record
            const transaction = await Transaction.create({
                auction: auctionId,
                bidder: req.user._id,
                auctioneer: auction.createdBy._id,
                amount: amount,
                status: "Pending",
                paymentReference: order.id,
                paymentMethod: "RazorPay",
                notes: `Payment for auction: ${auction.title || 'Unknown item'}`
            });
            
            res.status(201).json({
                success: true,
                message: "Payment transaction created successfully",
                transaction,
                order
            });
        } catch (orderError) {
            console.error("Error creating Razorpay order details:", orderError);
            
            let errorMessage = "Unknown error";
            
            // Extract the actual error message from Razorpay response
            if (orderError.error && orderError.error.description) {
                errorMessage = orderError.error.description;
                console.error("Razorpay error description:", errorMessage);
            } else if (orderError.message) {
                errorMessage = orderError.message;
            }
            
            if (orderError.error && typeof orderError.error === 'object') {
                console.error("Razorpay API error:", JSON.stringify(orderError.error, null, 2));
            }
            
            res.status(500);
            throw new Error(`Failed to create payment order: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error in createAuctionPayment:", error);
        if (!res.statusCode || res.statusCode === 200) {
            res.status(500);
        }
        throw error;
    }
});