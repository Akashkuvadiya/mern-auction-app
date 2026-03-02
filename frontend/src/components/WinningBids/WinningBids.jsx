// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { FaMoneyBillWave, FaTrophy } from "react-icons/fa";
// import { BiRightArrowAlt } from "react-icons/bi";
// import { getWinningAuctions } from "../../store/slices/auctionSlice";
// import Spinner from "../../custom-components/Spinner";

// const WinningBids = () => {
//   const { winningAuctions, loading } = useSelector((state) => state.auction);
//   const { user, isAuthenticated } = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated || user.role !== "Bidder") {
//       navigate("/");
//     }
//     dispatch(getWinningAuctions());
//   }, [dispatch, isAuthenticated, navigate, user?.role]);

//   const initiatePayment = (auctionId, transactionId) => {
//     if (transactionId) {
//       // If transaction exists, go to payment page
//       navigate(`/payment/${transactionId}`);
//     } else {
//       // Create payment transaction first
//       navigate(`/create-payment/${auctionId}`);
//     }
//   };

//   return (
//     <section className="w-full min-h-screen p-6 lg:pl-[320px] pt-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
//               <FaTrophy className="text-yellow-500" />
//               Your Winning Auctions
//             </h1>
//             <p className="mt-2 text-gray-600 dark:text-gray-300">
//               View and manage all the auctions you've won
//             </p>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center">
//             <Spinner />
//           </div>
//         ) : winningAuctions && winningAuctions.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {winningAuctions.map((auction) => (
//               <div
//                 key={auction._id}
//                 className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
//               >
//                 <div className="h-48 relative overflow-hidden">
//                   <img
//                     src={auction.image?.url}
//                     alt={auction.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
//                     <h3 className="text-white text-xl font-bold">
//                       {auction.title}
//                     </h3>
//                   </div>
//                 </div>
//                 <div className="p-5 space-y-4">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Your winning bid
//                       </p>
//                       <p className="text-2xl font-bold text-gray-800 dark:text-white">
//                         ₹{auction.currentBid}
//                       </p>
//                     </div>
//                     <div
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         auction.paymentStatus === "Approved"
//                           ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
//                           : auction.paymentStatus === "Processing"
//                           ? "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400"
//                           : auction.paymentStatus === "Failed"
//                           ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
//                           : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400"
//                       }`}
//                     >
//                       {auction.paymentStatus}
//                     </div>
//                   </div>

//                   <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Auctioneer
//                     </p>
//                     <p className="text-gray-800 dark:text-white">
//                       {auction.createdBy.userName}
//                     </p>
//                   </div>

//                   {auction.paymentStatus !== "Approved" && (
//                     <button
//                       onClick={() =>
//                         initiatePayment(auction._id, auction.transactionId)
//                       }
//                       className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
//                     >
//                       <FaMoneyBillWave />
//                       {auction.paymentStatus === "Pending"
//                         ? "Pay Now"
//                         : "View Payment"}
//                     </button>
//                   )}

//                   <Link
//                     to={`/auction/details/${auction._id}`}
//                     className="w-full flex items-center justify-center gap-2 bg-transparent text-gray-700 dark:text-gray-300 py-2 font-medium hover:text-blue-600 dark:hover:text-blue-400"
//                   >
//                     View Auction Details <BiRightArrowAlt />
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
//             <img
//               src="/no-data.svg"
//               alt="No winning auctions"
//               className="w-64 h-64 opacity-70 mb-6"
//             />
//             <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
//               No Winning Auctions Yet
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
//               You haven't won any auctions yet. Keep bidding to win!
//             </p>
//             <Link
//               to="/auctions"
//               className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium flex items-center gap-2 transition-all duration-300"
//             >
//               Browse Auctions <BiRightArrowAlt />
//             </Link>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default WinningBids;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaTrophy,
  FaFire,
  FaCheckCircle,
} from "react-icons/fa";
import { BiRightArrowAlt } from "react-icons/bi";
import { getWinningAuctions } from "../../store/slices/auctionSlice";
import Spinner from "../../custom-components/Spinner";

const WinningBids = () => {
  const { winningAuctions, loading } = useSelector((state) => state.auction);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user.role !== "Bidder") {
      navigate("/");
    }
    dispatch(getWinningAuctions());
  }, [dispatch, isAuthenticated, navigate, user?.role]);

  const initiatePayment = (auctionId, transactionId) => {
    if (transactionId) {
      // If transaction exists, go to payment page
      navigate(`/payment/${transactionId}`);
    } else {
      // Create payment transaction first
      navigate(`/create-payment/${auctionId}`);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <article className="w-full ml-0 m-0 h-fit px-5 pt-8 lg:pl-[320px] flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <span className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 mr-4">
                    <FaTrophy className="w-8 h-8" />
                  </span>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      Your Winning Auctions
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      View and manage all the auctions you've won
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
                    <FaTrophy className="w-4 h-4 mr-2" />
                    {winningAuctions?.length || 0} Won Auctions
                  </span>
                </div>
              </div>
            </div>

            {winningAuctions && winningAuctions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {winningAuctions.map((auction, index) => (
                  <div
                    key={auction._id}
                    className="flex-grow basis-full bg-white dark:bg-gray-800/50 rounded-3xl group hover:border-yellow-500 dark:hover:border-yellow-500/50 hover:shadow-yellow-500/10 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="relative p-6 overflow-hidden">
                      <div className="flex flex-col items-start gap-4 relative h-full">
                        <div className="group relative w-full overflow-hidden rounded-2xl aspect-video">
                          <span
                            className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center
                                rounded-full bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200
                                text-black text-sm font-medium backdrop-blur-sm border border-white/10 shadow-lg"
                          >
                            {(index + 1).toString().padStart(2, "0")}
                          </span>

                          <img
                            src={auction.image?.url}
                            alt={auction.title}
                            className="w-full h-full object-cover brightness-90 transition-all duration-500 group-hover:brightness-125"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-white text-xl font-semibold line-clamp-2">
                                {auction.title}
                              </h3>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 w-full space-y-4">
                          <div
                            className={`
                            ${
                              auction.paymentStatus === "Approved"
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                : auction.paymentStatus === "Processing"
                                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                                : auction.paymentStatus === "Failed"
                                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                            } p-4 rounded-2xl border`}
                          >
                            <div
                              className={`flex items-center gap-2 
                              ${
                                auction.paymentStatus === "Approved"
                                  ? "text-green-600 dark:text-green-400"
                                  : auction.paymentStatus === "Processing"
                                  ? "text-blue-600 dark:text-blue-400"
                                  : auction.paymentStatus === "Failed"
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-yellow-600 dark:text-yellow-400"
                              } font-semibold mb-2`}
                            >
                              {auction.paymentStatus === "Approved" ? (
                                <FaCheckCircle className="w-5 h-5" />
                              ) : (
                                <FaFire className="w-5 h-5" />
                              )}
                              Payment Status: {auction.paymentStatus}
                            </div>
                            <p
                              className={`
                              ${
                                auction.paymentStatus === "Approved"
                                  ? "text-green-600/80 dark:text-green-400/80"
                                  : auction.paymentStatus === "Processing"
                                  ? "text-blue-600/80 dark:text-blue-400/80"
                                  : auction.paymentStatus === "Failed"
                                  ? "text-red-600/80 dark:text-red-400/80"
                                  : "text-yellow-600/80 dark:text-yellow-400/80"
                              } text-sm`}
                            >
                              {auction.paymentStatus === "Approved"
                                ? "Payment completed successfully!"
                                : auction.paymentStatus === "Processing"
                                ? "Your payment is being processed."
                                : auction.paymentStatus === "Failed"
                                ? "Payment failed. Please try again."
                                : "Payment pending. Please complete your payment."}
                            </p>
                          </div>

                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-3 backdrop-blur-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-300">
                                Your Winning Bid
                              </span>
                              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                ₹{auction.currentBid}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-gray-600 dark:text-gray-300">
                                Auctioneer
                              </span>
                              <span className="text-gray-800 dark:text-white font-medium">
                                {auction.createdBy.userName}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3 pt-2">
                            {auction.paymentStatus !== "Approved" && (
                              <button
                                onClick={() =>
                                  initiatePayment(
                                    auction._id,
                                    auction.transactionId
                                  )
                                }
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                              >
                                <FaMoneyBillWave className="w-4 h-4" />
                                {auction.paymentStatus === "Pending"
                                  ? "Pay Now"
                                  : "View Payment"}
                              </button>
                            )}

                            <Link
                              to={`/auction/details/${auction._id}`}
                              className="w-full flex items-center justify-center gap-2 bg-transparent text-gray-700 dark:text-gray-300 py-2 font-medium hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              View Auction Details{" "}
                              <BiRightArrowAlt className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800/50 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700">
                <img
                  src="/no-data.svg"
                  alt="No winning auctions"
                  className="w-64 h-64 opacity-70 mb-6"
                />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Winning Auctions Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                  You haven't won any auctions yet. Keep bidding to win!
                </p>
                <Link
                  to="/auctions"
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Browse Auctions <BiRightArrowAlt className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </article>
      )}
    </>
  );
};

export default WinningBids;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { FaMoneyBillWave, FaTrophy } from "react-icons/fa";
// import { BiRightArrowAlt } from "react-icons/bi";
// import { getWinningAuctions } from "../../store/slices/auctionSlice";
// import Spinner from "../../custom-components/Spinner";

// const WinningBids = () => {
//   const { winningAuctions, loading } = useSelector((state) => state.auction);
//   const { user, isAuthenticated } = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated || user?.role !== "Bidder") {
//       navigate("/");
//     }
//     dispatch(getWinningAuctions());
//   }, [dispatch, isAuthenticated, navigate, user?.role]);

//   const initiatePayment = (auctionId, transactionId) => {
//     if (transactionId) {
//       // If transaction exists, go to payment page
//       navigate(`/payment/${transactionId}`);
//     } else {
//       // Create payment transaction first
//       navigate(`/create-payment/${auctionId}`);
//     }
//   };

//   const getStatusClassName = (status) => {
//     switch (status) {
//       case "Approved":
//         return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400";
//       case "Processing":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400";
//       case "Failed":
//         return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400";
//       default:
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400";
//     }
//   };

//   if (loading) {
//     return <Spinner />;
//   }

//   return (
//     <article className="w-full min-h-screen p-6 lg:pl-[320px] pt-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl p-6 mb-8 shadow-lg">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
//             <div className="flex items-center gap-4 mb-4 md:mb-0">
//               <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-tr from-yellow-500 to-amber-600 text-white shadow-lg">
//                 <FaTrophy className="w-6 h-6" />
//               </span>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
//                   Your Winning Auctions
//                 </h1>
//                 <p className="text-gray-600 dark:text-gray-300 text-sm">
//                   View and manage all the auctions you've won
//                 </p>
//               </div>
//             </div>
//             <div className="inline-flex items-center px-4 py-2 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-medium">
//               <FaTrophy className="w-4 h-4 mr-2" />
//               {winningAuctions?.length || 0} Won Auctions
//             </div>
//           </div>
//         </div>

//         {winningAuctions && winningAuctions.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {winningAuctions.map((auction, index) => (
//               <div
//                 key={auction._id}
//                 className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
//               >
//                 <div className="h-48 relative overflow-hidden">
//                   <img
//                     src={auction.image?.url}
//                     alt={auction.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute top-2 right-2 z-10">
//                     <span className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 text-white text-sm font-medium">
//                       {index + 1}
//                     </span>
//                   </div>
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
//                     <h3 className="text-white text-xl font-bold">
//                       {auction.title}
//                     </h3>
//                   </div>
//                 </div>

//                 <div className="p-5 space-y-4">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Your winning bid
//                       </p>
//                       <p className="text-2xl font-bold text-green-600 dark:text-green-500">
//                         ₹{auction.currentBid}
//                       </p>
//                     </div>
//                     <div
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClassName(
//                         auction.paymentStatus
//                       )}`}
//                     >
//                       {auction.paymentStatus}
//                     </div>
//                   </div>

//                   <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Auctioneer
//                     </p>
//                     <p className="text-gray-800 dark:text-white">
//                       {auction.createdBy.userName}
//                     </p>
//                   </div>

//                   <div className="space-y-3 pt-2">
//                     {auction.paymentStatus !== "Approved" && (
//                       <button
//                         onClick={() =>
//                           initiatePayment(auction._id, auction.transactionId)
//                         }
//                         className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300"
//                       >
//                         <FaMoneyBillWave className="w-4 h-4" />
//                         {auction.paymentStatus === "Pending"
//                           ? "Pay Now"
//                           : "View Payment"}
//                       </button>
//                     )}

//                     <Link
//                       to={`/auction/details/${auction._id}`}
//                       className="w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 py-2 font-medium hover:text-blue-600 dark:hover:text-blue-400"
//                     >
//                       View Auction Details{" "}
//                       <BiRightArrowAlt className="w-4 h-4" />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
//             <img
//               src="/no-data.svg"
//               alt="No winning auctions"
//               className="w-64 h-64 opacity-70 mb-6"
//             />
//             <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
//               No Winning Auctions Yet
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
//               You haven't won any auctions yet. Keep bidding to win!
//             </p>
//             <Link
//               to="/auctions"
//               className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium flex items-center gap-2 transition-all duration-300"
//             >
//               Browse Auctions <BiRightArrowAlt className="w-4 h-4" />
//             </Link>
//           </div>
//         )}
//       </div>
//     </article>
//   );
// };

// export default WinningBids;
