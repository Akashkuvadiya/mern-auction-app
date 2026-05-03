const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f2f5; }
    .wrapper { max-width: 620px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
    .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 36px 40px; text-align: center; }
    .header h1 { color: #fff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 4px; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 18px; font-weight: 700; color: #1e1b4b; margin-bottom: 12px; }
    .text { font-size: 15px; color: #4b5563; line-height: 1.7; margin-bottom: 20px; }
    .card { background: #f5f3ff; border: 1px solid #e0e7ff; border-radius: 10px; padding: 24px; margin: 24px 0; }
    .card-title { font-size: 13px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e7ff; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #6b7280; }
    .detail-value { color: #111827; font-weight: 600; }
    .highlight { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; border-radius: 8px; padding: 16px 24px; text-align: center; margin: 24px 0; }
    .highlight .amount { font-size: 32px; font-weight: 800; }
    .highlight .label { font-size: 13px; opacity: 0.85; margin-top: 4px; }
    .badge { display: inline-block; background: #dcfce7; color: #16a34a; border-radius: 20px; padding: 4px 14px; font-size: 13px; font-weight: 600; }
    .badge.warn { background: #fef9c3; color: #ca8a04; }
    .badge.danger { background: #fee2e2; color: #dc2626; }
    .methods { margin: 20px 0; }
    .method { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 18px; margin-bottom: 10px; }
    .method-title { font-size: 13px; font-weight: 700; color: #4f46e5; margin-bottom: 6px; }
    .method-detail { font-size: 13px; color: #374151; line-height: 1.6; }
    .deadline { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 14px 18px; text-align: center; margin: 20px 0; }
    .deadline strong { color: #c2410c; }
    .footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 24px 40px; text-align: center; }
    .footer p { font-size: 13px; color: #9ca3af; line-height: 1.6; }
    .footer strong { color: #6366f1; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🏆 PrimeBid</h1>
      <p>Auction Platform</p>
    </div>
    ${content}
    <div class="footer">
      <p>© 2026 <strong>PrimeBid</strong>. All rights reserved.<br/>
      This is an automated email — please do not reply directly.</p>
    </div>
  </div>
</body>
</html>`;

// 1. Auction Won (to Bidder)
export const auctionWonEmail = ({ bidderName, auctionTitle, auctioneer, formattedDueDate }) =>
  baseTemplate(`
  <div class="body">
    <p class="greeting">🎉 Congratulations, ${bidderName}!</p>
    <p class="text">You've won the auction for <strong>"${auctionTitle}"</strong>. Complete your payment before the deadline to secure your item.</p>
    <div class="deadline">⏰ Payment due by <strong>${formattedDueDate}</strong></div>
    <div class="card">
      <p class="card-title">Auctioneer Contact</p>
      <div class="detail-row">
        <span class="detail-label">Email : </span>
        <span class="detail-value">${auctioneer.email}</span>
      </div>
    </div>
    <p class="text" style="font-weight:600; color:#1e1b4b;">Choose a payment method:</p>
    <div class="methods">
      <div class="method">
        <p class="method-title">🏦 Bank Transfer</p>
        <p class="method-detail">
          Name: <strong>${auctioneer.paymentMethods.bankTransfer.bankAccountName}</strong><br/>
          Account: <strong>${auctioneer.paymentMethods.bankTransfer.bankAccountNumber}</strong><br/>
          Bank: <strong>${auctioneer.paymentMethods.bankTransfer.bankName}</strong>
        </p>
      </div>
      <div class="method">
        <p class="method-title">💳 Razorpay</p>
        <p class="method-detail">Account: <strong>${auctioneer.paymentMethods.razorpay?.razorpayAccountNumber || "N/A"}</strong></p>
      </div>
      <div class="method">
        <p class="method-title">🅿️ PayPal</p>
        <p class="method-detail">Email: <strong>${auctioneer.paymentMethods.paypal.paypalEmail}</strong></p>
      </div>
      <div class="method">
        <p class="method-title">🚚 Cash on Delivery</p>
        <p class="method-detail">Pay <strong>20% upfront</strong> before delivery. Remaining <strong>80% on delivery</strong>.</p>
      </div>
    </div>
  </div>`);

// 2. Payment Success (to Bidder)
export const paymentSuccessEmail = ({ bidderName, auctionTitle, amount, paymentId, orderId }) =>
  baseTemplate(`
  <div class="body">
    <p class="greeting">✅ Payment Confirmed, ${bidderName}!</p>
    <p class="text">Your payment for <strong>"${auctionTitle}"</strong> has been successfully processed.</p>
    <div class="highlight">
      <div class="amount">$ ${Number(amount).toLocaleString('en-IN')}</div>
      <div class="label">Total Paid</div>
    </div>
    <div class="card">
      <p class="card-title">Transaction Details</p>
      <div class="detail-row"><span class="detail-label">Payment ID</span><span class="detail-value">${paymentId}</span></div>
      <div class="detail-row"><span class="detail-label">Order ID</span><span class="detail-value">${orderId}</span></div>
      <div class="detail-row"><span class="detail-label">Amount</span><span class="detail-value">$ ${Number(amount).toLocaleString('en-IN')}</span></div>
      <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="badge">Confirmed ✓</span></span></div>
    </div>
    <p class="text">Your item will be shipped once the auctioneer confirms. Thank you for using PrimeBid!</p>
  </div>`);

// 3. Payment Received (to Auctioneer)
export const auctioneerPaymentEmail = ({ auctioneerName, auctionTitle, amount, commissionRate, commissionAmount, netAmount, walletBalance }) =>
  baseTemplate(`
  <div class="body">
    <p class="greeting">💰 Payment Received, ${auctioneerName}!</p>
    <p class="text">The payment for <strong>"${auctionTitle}"</strong> has been processed and credited to your wallet.</p>
    <div class="highlight">
      <div class="amount">$ ${Number(netAmount).toLocaleString('en-IN')}</div>
      <div class="label">Credited to Your Wallet</div>
    </div>
    <div class="card">
      <p class="card-title">Earnings Breakdown</p>
      <div class="detail-row"><span class="detail-label">Selling Price</span><span class="detail-value">$ ${Number(amount).toLocaleString('en-IN')}</span></div>
      <div class="detail-row"><span class="detail-label">Commission (${commissionRate * 100}%)</span><span class="detail-value" style="color:#dc2626;">- $ ${Number(commissionAmount).toLocaleString('en-IN')}</span></div>
      <div class="detail-row"><span class="detail-label">Net Credited</span><span class="detail-value" style="color:#16a34a;">$ ${Number(netAmount).toLocaleString('en-IN')}</span></div>
      <div class="detail-row"><span class="detail-label">Wallet Balance</span><span class="detail-value">$ ${Number(walletBalance).toLocaleString('en-IN')}</span></div>
    </div>
    <p class="text">Withdraw your funds anytime from your wallet dashboard.</p>
  </div>`);

// 4. Admin Payment Notification
export const adminPaymentEmail = ({ auctionTitle, bidderName, bidderEmail, auctioneerName, auctioneerEmail, amount, commissionRate, commissionAmount, netAmount, paymentId }) =>
  baseTemplate(`
  <div class="body">
    <p class="greeting">📊 New Payment Settled</p>
    <p class="text">A payment has been verified and settled for <strong>"${auctionTitle}"</strong>.</p>
    <div class="card">
      <p class="card-title">Transaction Summary</p>
      <div class="detail-row"><span class="detail-label">Bidder</span><span class="detail-value">${bidderName} (${bidderEmail})</span></div>
      <div class="detail-row"><span class="detail-label">Auctioneer</span><span class="detail-value">${auctioneerName} (${auctioneerEmail})</span></div>
      <div class="detail-row"><span class="detail-label">Total Amount</span><span class="detail-value">$ ${Number(amount).toLocaleString('en-IN')}</span></div>
      <div class="detail-row"><span class="detail-label">Commission (${commissionRate * 100}%)</span><span class="detail-value">$ ${Number(commissionAmount).toLocaleString('en-IN')}</span></div>
      <div class="detail-row"><span class="detail-label">Auctioneer Payout</span><span class="detail-value" style="color:#16a34a;">$ ${Number(netAmount).toLocaleString('en-IN')}</span></div>
      <div class="detail-row"><span class="detail-label">Payment ID</span><span class="detail-value">${paymentId}</span></div>
    </div>
  </div>`);

// 5. Withdrawal Request (to Admin)
export const withdrawalRequestEmail = ({ userName, userEmail, amount, transferMethod, withdrawalId }) =>
  baseTemplate(`
  <div class="body">
    <p class="greeting">🏧 New Withdrawal Request</p>
    <p class="text">A withdrawal request has been submitted and requires your attention.</p>
    <div class="card">
      <p class="card-title">Withdrawal Details</p>
      <div class="detail-row"><span class="detail-label">User</span><span class="detail-value">${userName} (${userEmail})</span></div>
      <div class="detail-row"><span class="detail-label">Amount</span><span class="detail-value">$ ${Number(amount).toLocaleString('en-IN')}</span></div>
      <div class="detail-row"><span class="detail-label">Method</span><span class="detail-value">${transferMethod}</span></div>
      <div class="detail-row"><span class="detail-label">Request ID</span><span class="detail-value">${withdrawalId}</span></div>
      <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="badge warn">Pending Review</span></span></div>
    </div>
    <p class="text">Please process this from the admin dashboard.</p>
  </div>`);

// 6. Withdrawal Status (to User)
export const withdrawalStatusEmail = ({ userName, amount, status, transferMethod, remarks }) => {
  const isSuccess = status === "Completed";
  const methodLabel = transferMethod === "BankTransfer" ? "bank account"
    : transferMethod === "RazorpayTransfer" ? "Razorpay account" : "PayPal account";
  const statusMsg = isSuccess
    ? `Your withdrawal of <strong>$ ${Number(amount).toLocaleString('en-IN')}</strong> has been transferred to your ${methodLabel}.`
    : `Your withdrawal of <strong>$ ${Number(amount).toLocaleString('en-IN')}</strong> could not be processed. Funds have been returned to your wallet.`;

  return baseTemplate(`
  <div class="body">
    <p class="greeting">Withdrawal ${status}</p>
    <p class="text">${statusMsg}</p>
    <div class="card">
      <p class="card-title">Withdrawal Details</p>
      <div class="detail-row"><span class="detail-label">Amount</span><span class="detail-value">$ ${Number(amount).toLocaleString('en-IN')}</span></div>
      <div class="detail-row"><span class="detail-label">Method</span><span class="detail-value">${transferMethod}</span></div>
      <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="badge ${isSuccess ? '' : 'danger'}">${status}</span></span></div>
      ${remarks ? `<div class="detail-row"><span class="detail-label">Remarks</span><span class="detail-value">${remarks}</span></div>` : ""}
    </div>
    <p class="text">Questions? Contact our support team.</p>
  </div>`);
};