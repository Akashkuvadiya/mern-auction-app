import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";
import { User } from "../models/userSchema.js";
import { Bid } from "../models/bidSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
import { calculateCommission } from "../controllers/commissionController.js";

export const endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      const now = new Date();
      console.log("Cron for ended auction running at", now.toISOString());

      // Fetch all ended auctions that haven't been processed.
      const endedAuctions = await Auction.find({
        commissionCalculated: false,
        endTime: { $lt: now }
      });

      if (!endedAuctions || endedAuctions.length === 0) {
        console.log("No ended auctions found.");
      }

      for (const auction of endedAuctions) {
        try {
          // Calculate commission for this auction.
          const commissionAmount = await calculateCommission(auction._id);
          // Mark the auction as processed.
          auction.commissionCalculated = true;

          // Update the auctioneer's unpaid commission by adding the commission amount.
          const auctioneer = await User.findById(auction.createdBy);
          if (!auctioneer) {
            console.error(`Auctioneer not found for auction ${auction._id}`);
            continue;
          }
          await User.findByIdAndUpdate(
            auctioneer._id,
            { $inc: { unpaidCommission: commissionAmount } },
            { new: true }
          );

          // Find the winning bid (bid whose amount equals auction.currentBid).
          const winningBid = await Bid.findOne({
            auctionItem: auction._id,
            amount: auction.currentBid,
          });

          if (winningBid) {
            // Record the winning bidder on the auction.
            auction.highestBidder = winningBid.bidder.id;
            await auction.save();

            // Update the winning bidder's records.
            const bidder = await User.findById(winningBid.bidder.id);
            if (bidder) {
              await User.findByIdAndUpdate(
                bidder._id,
                {
                  $inc: {
                    moneySpent: winningBid.amount,
                    auctionWon: 1,
                  },
                },
                { new: true }
              );
            } else {
              console.error(
                `Bidder not found for winning bid ${winningBid._id}`
              );
            }

            // Prepare email notification for the winning bidder.
            const subject = `Congratulations! You won the auction for ${auction.title}`;

            // Calculate payment due date (7 days from now)
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7);
            const formattedDueDate = dueDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            const message = `Dear ${bidder.userName},

Congratulations! You have won the auction for "${auction.title}".
Before proceeding with payment, please contact your auctioneer via email: ${auctioneer.email
              }.

Please complete your payment using one of the following methods:

1. Bank Transfer:
   - Account Name: ${auctioneer.paymentMethods.bankTransfer.bankAccountName}
   - Account Number: ${auctioneer.paymentMethods.bankTransfer.bankAccountNumber}
   - Bank: ${auctioneer.paymentMethods.bankTransfer.bankName}

2. razorpay:
   - Account Number: ${auctioneer.paymentMethods.razorpay
                ? auctioneer.paymentMethods.razorpay.razorpayAccountNumber
                : "N/A"
              }

3. PayPal:
   - Email: ${auctioneer.paymentMethods.paypal.paypalEmail}

4. Cash on Delivery (COD):
   - If you prefer COD, you must pay 20% of the total amount upfront before delivery.
   - The remaining 80% will be paid upon delivery.

Please ensure your payment is completed by ${formattedDueDate}. Once we confirm the payment, the item will be shipped to you.

Thank you for participating!

Best regards,
Auction Team`;

            console.log("SENDING EMAIL TO WINNING BIDDER");
            try {
              await sendEmail({ email: bidder.email, subject, message });
              console.log("SUCCESSFULLY SENT EMAIL TO WINNING BIDDER");
            } catch (emailError) {
              console.error(`Failed to send email notification: ${emailError.message}`);
              // Continue processing the auction even if email fails
            }
          } else {
            // If no winning bid exists, simply save the auction state.
            await auction.save();
          }
        } catch (innerError) {
          console.error(
            `Error processing auction ${auction._id}: ${innerError.message}`
          );
        }
      }
    } catch (error) {
      console.error("Error in ended auction cron:", error.message);
    }
  });
};
