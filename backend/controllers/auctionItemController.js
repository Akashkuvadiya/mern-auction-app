import mongoose from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import Transaction from "../models/transactionSchema.js";

// Enhanced date parsing to handle the specified format:
// Sat, Apr 26, 2025, 11:00:00 AM GMT+05:30 (Indian Standard Time)
const parseCustomDate = (dateStr) => {
  if (!dateStr) {
    console.warn("Empty date string provided");
    return new Date();
  }
  
  // First try to parse as ISO string (for backward compatibility)
  let date = new Date(dateStr);
  
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  // Handle the custom format
  try {
    // Clean up the string by removing the timezone name in parentheses
    const cleanStr = dateStr.replace(/\s*\([^)]*\)$/, "");
    
    // Try to parse the clean string
    date = new Date(cleanStr);
    
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    // If that fails, try more specialized parsing
    const regex = /([a-zA-Z]{3}),\s+([a-zA-Z]{3})\s+(\d{1,2}),\s+(\d{4}),\s+(\d{1,2}):(\d{2}):(\d{2})\s+([AP]M)\s+([^(]+)/;
    const matches = cleanStr.match(regex);
    
    if (matches) {
      const [, , month, day, year, hours, minutes, seconds, ampm, timezone] = matches;
      
      // Convert month name to month number
      const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
      const monthNum = months[month];
      
      // Parse hours (12-hour format)
      let hrs = parseInt(hours, 10);
      if (ampm === 'PM' && hrs < 12) hrs += 12;
      if (ampm === 'AM' && hrs === 12) hrs = 0;
      
      // Create date with timezone info
      const dateString = `${year}-${monthNum + 1}-${day.padStart(2, '0')}T${hrs.toString().padStart(2, '0')}:${minutes}:${seconds}${timezone}`;
      return new Date(dateString);
    }
  } catch (error) {
    console.error("Error parsing date:", error, "Original string:", dateStr);
  }
  
  // Fallback to current date if parsing fails
  console.warn(`Failed to parse date: ${dateStr}, using current date instead`);
  return new Date();
};

// 1. Add New Auction Item
export const addNewAuctionItem = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Auction Item Image Required.", 400));
  }
  const { image } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(image.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }
  const {
    title,
    description,
    category,
    condition,
    startingBid,
    startTime,
    endTime,
  } = req.body;
  if (
    !title ||
    !description ||
    !category ||
    !condition ||
    !startingBid ||
    !startTime ||
    !endTime
  ) {
    return next(new ErrorHandler("Please provide all details.", 400));
  }

  // Convert the provided date strings to Date objects for validation
  const parsedStartTime = parseCustomDate(startTime);
  const parsedEndTime = parseCustomDate(endTime);
  
  if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
    return next(new ErrorHandler("Invalid date format provided.", 400));
  }

  if (parsedStartTime < new Date()) {
    return next(
      new ErrorHandler(
        "Auction starting time must be greater than present time.",
        400
      )
    );
  }
  // Validate that the start time is strictly less than the end time.
  if (parsedStartTime >= parsedEndTime) {
    return next(
      new ErrorHandler(
        "Auction starting time must be less than ending time.",
        400
      )
    );
  }

  // Check for an active auction for the user.
  const alreadyOneAuctionActive = await Auction.find({
    createdBy: req.user._id,
    endTime: { $gt: new Date() },
  });
  if (alreadyOneAuctionActive.length > 0) {
    return next(new ErrorHandler("You already have one active auction.", 400));
  }
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath,
      {
        folder: "MERN_AUCTION_PLATEFORM_AUCTION",
      }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      return next(
        new ErrorHandler("Failed to upload auction image to Cloudinary.", 500)
      );
    }
    
    // Format the dates to match the specified format for display purposes
    const formattedStartTime = parsedStartTime.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    }) + " (Indian Standard Time)";
    
    const formattedEndTime = parsedEndTime.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    }) + " (Indian Standard Time)";
    
    console.log(`Saving auction with start time: ${formattedStartTime}, end time: ${formattedEndTime}`);
    
    const auctionItem = await Auction.create({
      title,
      description,
      category,
      condition,
      startingBid,
      // Store the dates as Date objects in MongoDB
      startTime: parsedStartTime,
      endTime: parsedEndTime,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      createdBy: req.user._id,
    });
    
    return res.status(201).json({
      success: true,
      message: `Auction item created and will be listed on auction page at ${formattedStartTime}`,
      auctionItem,
    });
  } catch (error) {
    return next(
      new ErrorHandler(error.message || "Failed to create auction.", 500)
    );
  }
});

// 2. Get All Auction Items
export const getAllItems = catchAsyncErrors(async (req, res, next) => {
  const items = await Auction.find();
  res.status(200).json({
    success: true,
    items,
  });
});

// 3. Get Auction Details (with bid sorting by amount)
export const getAuctionDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found", 404));
  }
  // Sort bids descending by amount.
  //     const sortedBids = auctionItem.bids.sort((a, b) => b.amount - a.amount);
  //     res.status(200).json({
  //         success: true,
  //         auctionItem,
  //         bids: sortedBids,
  //     });
  // });

  const bidders = auctionItem.bids.sort((a, b) => b.amount - a.amount);
  res.status(200).json({
    success: true,
    auctionItem,
    bidders,
  });
});

// 4. Get My Auction Items
export const getMyAuctionItems = catchAsyncErrors(async (req, res, next) => {
  const items = await Auction.find({ createdBy: req.user._id });
  res.status(200).json({
    success: true,
    items,
  });
});

// 5. Remove Auction Item
export const removeFromAuction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found", 404));
  }
  await auctionItem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Auction item deleted successfully.",
  });
});

// 6. Republish Auction Item (End Auction Functionality)
export const republishItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format", 400));
  }
  
  let auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found", 404));
  }
  
  if (!req.body.startTime || !req.body.endTime) {
    return next(
      new ErrorHandler(
        "Start time and end time for republish are mandatory.",
        400
      )
    );
  }
  
  // Auction must have ended before republishing
  const currentAuctionEnd = new Date(auctionItem.endTime);
  if (currentAuctionEnd > new Date()) {
    return next(
      new ErrorHandler("Auction is still active, cannot republish", 400)
    );
  }
  
  // Parse the new dates using our enhanced parser
  const newStartTime = parseCustomDate(req.body.startTime);
  const newEndTime = parseCustomDate(req.body.endTime);
  
  if (isNaN(newStartTime.getTime()) || isNaN(newEndTime.getTime())) {
    return next(new ErrorHandler("Invalid date format provided", 400));
  }
  
  if (newStartTime < new Date()) {
    return next(
      new ErrorHandler("Auction start time must be in the future", 400)
    );
  }
  
  if (newStartTime >= newEndTime) {
    return next(
      new ErrorHandler("Auction start time must be less than end time", 400)
    );
  }
  
  // Format the dates for display purposes
  const formattedStartTime = newStartTime.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  }) + " (Indian Standard Time)";
  
  const formattedEndTime = newEndTime.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  }) + " (Indian Standard Time)";
  
  console.log(`Republishing auction with start time: ${formattedStartTime}, end time: ${formattedEndTime}`);
  
  // Reverse previous winning bid impact if any.
  if (auctionItem.highestBidder) {
    const highestBidder = await User.findById(auctionItem.highestBidder);
    if (highestBidder) {
      highestBidder.moneySpent = Math.max(
        0,
        highestBidder.moneySpent - auctionItem.currentBid
      );
      highestBidder.auctionWon = Math.max(0, highestBidder.auctionWon - 1);
      await highestBidder.save();
    }
  }
  
  // Reset auction data for republishing.
  const updateData = {
    // Store Date objects directly
    startTime: newStartTime,
    endTime: newEndTime,
    bids: [],
    commissionCalculated: false,
    currentBid: 0,
    highestBidder: null,
  };
  
  auctionItem = await Auction.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  
  // Delete all existing bids for this auction.
  await Bid.deleteMany({ auctionItem: auctionItem._id });
  
  // Optionally, reset the auctioneer's unpaid commission.
  const createdBy = await User.findByIdAndUpdate(
    req.user._id,
    { unpaidCommission: 0 },
    {
      new: true,
      runValidators: false,
    }
  );
  
  res.status(200).json({
    success: true,
    auctionItem,
    message: `Auction republished and will be active on ${formattedStartTime}`,
    createdBy,
  });
});

// Get winning auctions for current user
export const getWinningAuctions = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log("Finding winning auctions for user:", req.user._id);

    // Find all auctions where the highestBidder matches the current user ID
    // Note: We're removing the date filter for now as it might cause issues with string date formats
    const winningAuctions = await Auction.find({
      highestBidder: req.user._id,
    }).populate("createdBy", "userName email paymentMethods");

    console.log(`Found ${winningAuctions.length} winning auctions`);

    // Get transactions to check which auctions have already been paid
    const transactions = await Transaction.find({
      bidder: req.user._id,
    });

    console.log(`Found ${transactions.length} transactions for this user`);

    // Add payment status to each auction
    const auctionsWithPaymentStatus = winningAuctions.map((auction) => {
      const transaction = transactions.find(
        (t) => t.auction && t.auction.toString() === auction._id.toString()
      );

      return {
        ...auction._doc,
        paymentStatus: transaction ? transaction.status : "Pending",
        transactionId: transaction ? transaction._id : null,
      };
    });

    res.status(200).json({
      success: true,
      winningAuctions: auctionsWithPaymentStatus,
    });
  } catch (error) {
    console.error("Error in getWinningAuctions:", error);
    return next(
      new ErrorHandler(error.message || "Failed to fetch winning auctions", 500)
    );
  }
});
