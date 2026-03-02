// import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
// import ErrorHandler from "../middlewares/error.js"
// import { Auction } from "../models/auctionSchema.js"
// import { Bid } from "../models/bidSchema.js"
// import { User } from "../models/userSchema.js";

// export const placeBid = catchAsyncErrors(async (req, res, next) => {
//     const { id } = req.params;

//     // Find the auction item by ID
//     const auctionItem = await Auction.findById(id);
//     if (!auctionItem) {
//         return next(new ErrorHandler("Auction item not found", 400));
//     }

//     const { amount } = req.body;
//     if (!amount) {
//         return next(new ErrorHandler("Please place your bid", 404));
//     }

//     // Validate bid amount
//     if (amount <= auctionItem.currentBid) {
//         return next(new ErrorHandler("Bid amount must be greater than the current bid.", 404));
//     }
//     if (amount < auctionItem.startingBid) {
//         return next(new ErrorHandler("Bid amount must be greater than the starting bid.", 404));
//     }

//     try {
//         // Check if the user has already placed a bid on this auction
//         const existingBid = await Bid.findOne({
//             "bidder.id": req.user._id,
//             auctionItem: auctionItem._id,
//         });

//         // Check if the bid exists in the auction item's bids array
//         const existingBidInAuction = auctionItem.bids.find(
//             (bid) => bid.userId.toString() === req.user._id.toString()
//         );

//         if (existingBid && existingBidInAuction) {
//             // Update existing bid
//             existingBidInAuction.amount = amount;
//             existingBid.amount = amount;
//             await existingBid.save();
//             auctionItem.currentBid = amount;
//         } else {
//             // Create a new bid
//             const bidderDetail = await User.findById(req.user._id);
//             const bid = await Bid.create({
//                 amount,
//                 bidder: {
//                     id: bidderDetail._id,
//                     userName: bidderDetail.userName,
//                     profileImage: bidderDetail.profileImage?.url || "",
//                 },
//                 auctionItem: auctionItem._id,
//             });

//             // Push the bid into the auction item's bids array
//             auctionItem.bids.push({
//                 userId: bidderDetail._id,
//                 userName: bidderDetail.userName,
//                 profileImage: bidderDetail.profileImage?.url || "",
//                 amount,
//             });

//             auctionItem.currentBid = amount;
//         }

//         // Save the updated auction item
//         await auctionItem.save();

//         res.status(201).json({
//             success: true,
//             message: "Bid placed.",
//             currentBid: auctionItem.currentBid,
//         });
//     } catch (error) {
//         return next(new ErrorHandler(error.message || "Failed to place bid.", 500));
//     }
// });

//  live bid show

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userSchema.js";

export const placeBid = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction Item not found.", 404));
  }
  const { amount } = req.body;
  if (!amount) {
    return next(new ErrorHandler("Please place your bid.", 404));
  }
  if (amount <= auctionItem.currentBid) {
    return next(
      new ErrorHandler("Bid amount must be greater than the current bid.", 404)
    );
  }
  if (amount < auctionItem.startingBid) {
    return next(
      new ErrorHandler("Bid amount must be greater than starting bid.", 404)
    );
  }

  try {
    const existingBid = await Bid.findOne({
      "bidder.id": req.user._id,
      auctionItem: auctionItem._id,
    });
    const existingBidInAuction = auctionItem.bids.find(
      (bid) => bid.userId.toString() == req.user._id.toString()
    );
    if (existingBid && existingBidInAuction) {
      existingBidInAuction.amount = amount;
      existingBid.amount = amount;
      await existingBidInAuction.save({ suppressWarning: true });
      await existingBid.save({ suppressWarning: true });
      auctionItem.currentBid = amount;
    } else {
      const bidderDetail = await User.findById(req.user._id);
      const bid = await Bid.create({
        amount,
        bidder: {
          id: bidderDetail._id,
          userName: bidderDetail.userName,
          profileImage: bidderDetail.profileImage?.url,
        },
        auctionItem: auctionItem._id,
      });
      auctionItem.bids.push({
        userId: req.user._id,
        userName: bidderDetail.userName,
        profileImage: bidderDetail.profileImage?.url,
        amount,
      });
      auctionItem.currentBid = amount;
    }
    await auctionItem.save({ suppressWarning: true });

    res.status(201).json({
      success: true,
      message: "Bid placed.",
      currentBid: auctionItem.currentBid,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Failed to place bid.", 500));
  }
});
