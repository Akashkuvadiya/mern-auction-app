// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   Container,
//   Typography,
//   Paper,
//   Grid,
//   Divider,
//   Alert,
//   CircularProgress,
//   Card,
//   CardMedia,
//   CardContent,
//   Chip,
// } from "@mui/material";
// import { ShoppingCart, CreditCard, Lock } from "@mui/icons-material";

// const PaymentPage = () => {
//   const { transactionId } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [paymentInfo, setPaymentInfo] = useState(null);
//   const [transaction, setTransaction] = useState(null);

//   useEffect(() => {
//     const loadScript = (src) => {
//       return new Promise((resolve) => {
//         const script = document.createElement("script");
//         script.src = src;
//         script.onload = () => {
//           resolve(true);
//         };
//         script.onerror = () => {
//           resolve(false);
//         };
//         document.body.appendChild(script);
//       });
//     };

//     const getPaymentData = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/v1/payment/payment-info/${transactionId}`,
//           {
//             withCredentials: true,
//           }
//         );

//         setPaymentInfo(response.data);
//         setTransaction(response.data.transaction);

//         // Load Razorpay script
//         const res = await loadScript(
//           "https://checkout.razorpay.com/v1/checkout.js"
//         );
//         if (!res) {
//           setError(
//             "Razorpay SDK failed to load. Please check your internet connection."
//           );
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching payment info:", error);
//         setError(
//           error.response?.data?.message ||
//             "Unable to load payment information. Please try again later."
//         );
//         setLoading(false);
//       }
//     };

//     getPaymentData();
//   }, [transactionId]);

//   const handlePayment = () => {
//     if (!window.Razorpay) {
//       setError("Payment gateway is not available. Please try again later.");
//       return;
//     }

//     const options = {
//       key: paymentInfo.razorpayKeyId,
//       amount: paymentInfo.amount * 100, // Amount in paise
//       currency: paymentInfo.currency,
//       name: "Auction System",
//       description: paymentInfo.description,
//       image: paymentInfo.image,
//       order_id: paymentInfo.orderId,
//       handler: function (response) {
//         // Redirect to success page with query params
//         navigate(
//           `/payment/success/${transactionId}?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`
//         );
//       },
//       prefill: {
//         name: paymentInfo.prefillInfo?.name || "",
//         email: paymentInfo.prefillInfo?.email || "",
//         contact: paymentInfo.prefillInfo?.contact || "",
//       },
//       theme: {
//         color: "#3f51b5",
//       },
//       modal: {
//         ondismiss: function () {
//           console.log("Payment modal closed without completing payment");
//         },
//       },
//     };

//     const razorpayInstance = new window.Razorpay(options);
//     razorpayInstance.open();
//   };

//   const handleCancel = () => {
//     navigate("/winning-bids"); // Go back to winning bids page
//   };

//   if (loading) {
//     return (
//       <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
//         <CircularProgress />
//         <Typography variant="h6" sx={{ mt: 2 }}>
//           Loading payment information...
//         </Typography>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="md" sx={{ mt: 8 }}>
//         <Alert severity="error" sx={{ mb: 4 }}>
//           {error}
//         </Alert>
//         <Button variant="contained" onClick={handleCancel}>
//           Back to Winning Auctions
//         </Button>
//       </Container>
//     );
//   }

//   const getItemName = () => {
//     if (!transaction || !transaction.auction) return "Auction Item";
//     return (
//       transaction.auction.title ||
//       transaction.auction.itemName ||
//       "Auction Item"
//     );
//   };

//   const getItemImage = () => {
//     if (!transaction || !transaction.auction) return null;
//     if (transaction.auction.image && transaction.auction.image.url) {
//       return transaction.auction.image.url;
//     }
//     if (transaction.auction.images && transaction.auction.images.length > 0) {
//       return transaction.auction.images[0].url;
//     }
//     return null;
//   };

//   return (
//     <Container maxWidth="md" sx={{ mt: 8 }}>
//       <Grid container spacing={4}>
//         <Grid item xs={12} md={7}>
//           <Typography variant="h4" component="h1" gutterBottom>
//             Complete Your Payment
//           </Typography>
//           <Typography color="text.secondary" paragraph>
//             Please review your order details and complete the payment
//           </Typography>

//           <Card sx={{ mb: 4, overflow: "hidden" }}>
//             <CardMedia
//               component="img"
//               height="200"
//               image={getItemImage() || "/placeholder.svg"}
//               alt={getItemName()}
//               sx={{ objectFit: "cover" }}
//             />
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 {getItemName()}
//               </Typography>

//               <Box
//                 sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
//               >
//                 <Typography variant="body2" color="text.secondary">
//                   Auction ID
//                 </Typography>
//                 <Typography variant="body1">
//                   {transaction?.auction?._id?.substring(0, 8) || "N/A"}
//                 </Typography>
//               </Box>

//               <Box
//                 sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
//               >
//                 <Typography variant="body2" color="text.secondary">
//                   Seller
//                 </Typography>
//                 <Typography variant="body1">
//                   {transaction?.auctioneer?.userName || "N/A"}
//                 </Typography>
//               </Box>

//               <Divider sx={{ my: 2 }} />

//               <Box
//                 sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
//               >
//                 <Typography variant="subtitle1">Total Amount</Typography>
//                 <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                   ₹{transaction?.amount?.toLocaleString() || 0}
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={5}>
//           <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
//             <Typography variant="h5" gutterBottom>
//               Payment Summary
//             </Typography>

//             <Box sx={{ my: 3 }}>
//               <Typography color="text.secondary" gutterBottom>
//                 Order ID
//               </Typography>
//               <Typography
//                 variant="body1"
//                 sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
//               >
//                 {paymentInfo?.orderId || "N/A"}
//               </Typography>
//             </Box>

//             <Divider sx={{ my: 2 }} />

//             <Box sx={{ my: 3 }}>
//               <Box
//                 sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
//               >
//                 <Typography>Item Price</Typography>
//                 <Typography>
//                   ₹{transaction?.amount?.toLocaleString() || 0}
//                 </Typography>
//               </Box>
//               <Box
//                 sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
//               >
//                 <Typography>Platform Fee</Typography>
//                 <Typography>₹0</Typography>
//               </Box>
//               <Box
//                 sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
//               >
//                 <Typography>Tax</Typography>
//                 <Typography>₹0</Typography>
//               </Box>
//             </Box>

//             <Divider sx={{ my: 2 }} />

//             <Box
//               sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
//             >
//               <Typography variant="h6">Total</Typography>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                 ₹{transaction?.amount?.toLocaleString() || 0}
//               </Typography>
//             </Box>

//             <Box sx={{ mt: 4 }}>
//               <Alert severity="info" icon={<Lock />} sx={{ mb: 3 }}>
//                 Your payment is secure. We use Razorpay's secure payment
//                 gateway.
//               </Alert>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 size="large"
//                 startIcon={<CreditCard />}
//                 onClick={handlePayment}
//                 sx={{ py: 1.5 }}
//               >
//                 Pay Now ₹{transaction?.amount?.toLocaleString() || 0}
//               </Button>

//               <Button
//                 variant="text"
//                 color="inherit"
//                 fullWidth
//                 onClick={handleCancel}
//                 sx={{ mt: 2 }}
//               >
//                 Cancel
//               </Button>
//             </Box>

//             <Box sx={{ mt: 4, textAlign: "center" }}>
//               <Typography variant="caption" color="text.secondary">
//                 By proceeding with the payment, you agree to our terms and
//                 conditions. Payment processed securely via Razorpay.
//               </Typography>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default PaymentPage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, CreditCard, Lock } from "@mui/icons-material";

const PaymentPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    const getPaymentData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/payment/payment-info/${transactionId}`,
          {
            withCredentials: true,
          }
        );

        setPaymentInfo(response.data);
        setTransaction(response.data.transaction);

        // Load Razorpay script
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!res) {
          setError(
            "Razorpay SDK failed to load. Please check your internet connection."
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment info:", error);
        setError(
          error.response?.data?.message ||
            "Unable to load payment information. Please try again later."
        );
        setLoading(false);
      }
    };

    getPaymentData();
  }, [transactionId]);

  const handlePayment = () => {
    if (!window.Razorpay) {
      setError("Payment gateway is not available. Please try again later.");
      return;
    }

    const options = {
      key: paymentInfo.razorpayKeyId,
      amount: paymentInfo.amount, // Amount in paise  * 100
      currency: paymentInfo.currency,
      name: "Auction System",
      description: paymentInfo.description,
      image: paymentInfo.image,
      order_id: paymentInfo.orderId,
      handler: function (response) {
        // Redirect to success page with query params
        navigate(
          `/payment/success/${transactionId}?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`
        );
      },
      prefill: {
        name: paymentInfo.prefillInfo?.name || "",
        email: paymentInfo.prefillInfo?.email || "",
        contact: paymentInfo.prefillInfo?.contact || "",
      },
      theme: {
        color: "#3f51b5",
      },
      modal: {
        ondismiss: function () {
          console.log("Payment modal closed without completing payment");
        },
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    console.log("RAZORPAY OPTIONS:", {
  key: paymentInfo.razorpayKeyId,
  order_id: paymentInfo.orderId,
  amount: paymentInfo.amount * 100,
});
    razorpayInstance.open();
  };

  const handleCancel = () => {
    navigate("/winning-bids"); // Go back to winning bids page
  };

  const getItemName = () => {
    if (!transaction || !transaction.auction) return "Auction Item";
    return (
      transaction.auction.title ||
      transaction.auction.itemName ||
      "Auction Item"
    );
  };

  const getItemImage = () => {
    if (!transaction || !transaction.auction) return null;
    if (transaction.auction.image && transaction.auction.image.url) {
      return transaction.auction.image.url;
    }
    if (transaction.auction.images && transaction.auction.images.length > 0) {
      return transaction.auction.images[0].url;
    }
    return null;
  };

  if (loading) {
    return (
      <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading payment information...
          </h2>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-xl mb-6">
            <p>{error}</p>
          </div>
          <button
            onClick={handleCancel}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Back to Winning Auctions
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-[83rem] mx-auto px-6 lg:pl-[320px] lg:mt-0 sm:mt-6">
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-300/20 to-emerald-300/20 rounded-full blur-2xl" />

          {/* Header Section */}
          <div className="relative mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Complete Your Payment
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 text-center">
              Please review your order details and complete the payment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            {/* Item Details Section - 4 columns */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[5px_5px_20px_rgba(255,255,255,0.2),-5px_5px_20px_rgba(255,255,255,0.2),0_5px_20px_rgba(255,255,255,0.2)] transition-shadow duration-300">
                {/* Item Image */}
                <div className="h-64 overflow-hidden">
                  <img
                    src={getItemImage() || "/placeholder.svg"}
                    alt={getItemName()}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Details */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                    {getItemName()}
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        Auction ID
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {transaction?.auction?._id?.substring(0, 8) || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        Seller
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {transaction?.auctioneer?.userName || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 my-4"></div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      $ {transaction?.amount?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary Section - 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:bg-gradient-to-r dark:from-gray-600 dark:to-gray-800 rounded-xl p-6 shadow-lg hover:shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[5px_5px_20px_rgba(255,255,255,0.2),-5px_5px_20px_rgba(255,255,255,0.2),0_5px_20px_rgba(255,255,255,0.2)] transition-shadow duration-300">
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                  Payment Summary
                </h3>

                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Order ID
                  </p>
                  <p className="font-mono text-sm bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                    {paymentInfo?.orderId || "N/A"}
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 my-6"></div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">
                      Item Price
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      $ {transaction?.amount?.toLocaleString() || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">
                      Platform Fee
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      $ 0
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">
                      Tax
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      $ 0
                    </span>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 my-6"></div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Total
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    $ {transaction?.amount?.toLocaleString() || 0}
                  </span>
                </div>

                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl flex items-start mb-6">
                  <Lock className="text-blue-600 dark:text-blue-400 mr-3 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Your payment is secure. We use Razorpay's secure payment
                    gateway.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handlePayment}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
                  >
                    <CreditCard className="mr-2" />
                    Pay Now $ {transaction?.amount?.toLocaleString() || 0}
                  </button>

                  <button
                    onClick={handleCancel}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
                  By proceeding with the payment, you agree to our terms and
                  conditions. Payment processed securely via Razorpay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
