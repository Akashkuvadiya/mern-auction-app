import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
import { FaUser, FaGavel, FaEnvelope, FaDollarSign } from "react-icons/fa";
import { TbLogin2 } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
// import Spinner from "../custom-components/Spinner";

const Home = () => {
  const howItWorks = [
    {
      icon: <FaUser />,
      title: "Post Items",
      description: "Auctioneer posts items for bidding.",
    },
    {
      icon: <FaGavel />,
      title: "Place Bids",
      description: "Bidders place bids on listed items.",
    },
    {
      icon: <FaEnvelope />,
      title: "Win Notification",
      description: "Highest bidder receives a winning email.",
    },
    {
      icon: <FaDollarSign />,
      title: "Payment & Fees",
      description: "Bidder pays; auctioneer pays 5% fee.",
    },
  ];

  const [isButton2Hovered, setIsButton2Hovered] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-8">
      <div className="max-w-full mx-auto px-6 lg:pl-[320px] lg:mt-0 sm:mt-6">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-300/20 to-emerald-300/20 rounded-full blur-3xl" />

        {/* Header Section */}
        <div className="mb-12">
          <p className="text-[#8EC3E6] font-bold text-xl mb-4 tracking-wide">
            Transparency Leads to Your Victory
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-500 to-gray-200 dark:text-[#CFCFCF]">
            Transparent Auctions
          </h1>

          {/* <h1
                        className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                        style={{
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        Be The Winner
                    </h1> */}

          <h1
            className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 typing-animation"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              display: "inline-block",
              animation:
                "typing 5s steps(20) infinite, blink 0.6s step-end infinite alternate",
            }}
          >
            Be The Winner
            <span className="text-gray-900">🥇</span>
          </h1>

          <style jsx>
            {`
              @keyframes typing {
                0% {
                  width: 0;
                }
                50% {
                  width: 100%;
                }
                100% {
                  width: 0;
                }
              }

              @keyframes blink {
                0% {
                  border-right-color: transparent;
                }
                100% {
                  border-right-color: black;
                }
              }

              .typing-animation {
                border-right: 2px solid black; /* Cursor effect */
                overflow: hidden; /* Ensures text doesn't overflow the container */
                display: inline-block; /* Ensures the width is inline */
                white-space: nowrap; /* Prevents text wrapping */
              }
            `}
          </style>

          {/* Authentication Links */}
          {!isAuthenticated && (
            <div className="flex gap-4 mb-12">
              <Link
                to="/sign-up"
                className={`border-2 border-blue-500 font-semibold rounded-[10px] px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2
                                ${
                                  isButton2Hovered
                                    ? "border-2 border-blue-500 text-blue-600 bg-transparent"
                                    : "bg-gradient-to-r dark:from-blue-500 dark:to-purple-500 text-black from-purple-300 via-indigo-300 to-pink-300 dark:text-white"
                                }`}
              >
                <FaUserPlus />
                <span>Sign Up</span>
              </Link>
              <Link
                to="/login"
                className={`border-2 border-blue-500 rounded-[10px] px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 font-semibold
                                ${
                                  isButton2Hovered
                                    ? "bg-gradient-to-r dark:from-blue-500 dark:to-purple-500 text-black from-purple-300 via-indigo-300 to-pink-300 dark:text-white"
                                    : "border-2 border-blue-500 text-blue-600 bg-transparent"
                                }`}
                onMouseEnter={() => setIsButton2Hovered(true)}
                onMouseLeave={() => setIsButton2Hovered(false)}
              >
                <TbLogin2 />
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-10 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-200 via-cyan-400 to-cyan-600 text-white group-hover:scale-110 transition-transform duration-300 mr-4">
                  <MdSettings className="w-6 h-6" />
                </span>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                  How it works
                </h3>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {howItWorks.map((step, index) => (
              <div
                key={step.title}
                className="group relative bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-600 dark:to-gray-800"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-300" />

                <div className="flex items-start gap-4 relative">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl">{step.icon}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <span className="absolute top-0 right-0 text-4xl font-bold text-gray-200 dark:text-gray-600">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Components */}
        <FeaturedAuctions />
        <UpcomingAuctions />
        <Leaderboard />

        {/* Footer Section */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-xl">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Explore Transparent and Fair Auctions with PrimeBid!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//     FaUserPlus,
//     FaShieldAlt,
//     FaChartLine,
//     FaHandshake
// } from 'react-icons/fa';
// import { TbLogin2 } from 'react-icons/tb';

// const Home = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [hoveredFeature, setHoveredFeature] = useState(null);

//     const features = [
//         {
//             icon: <FaShieldAlt />,
//             title: "Full Transparency",
//             description: "Every bid, every transaction is recorded and verifiable."
//         },
//         {
//             icon: <FaChartLine />,
//             title: "Real-time Analytics",
//             description: "Comprehensive insights into auction dynamics."
//         },
//         {
//             icon: <FaHandshake />,
//             title: "Fair Mechanisms",
//             description: "Advanced algorithms ensuring equal opportunity."
//         }
//     ];

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//             <div className="container mx-auto px-4 py-16 lg:px-20">

//                 {/* Features Grid */}
//                 <div className="grid md:grid-cols-3 gap-8">
//                     {features.map((feature, index) => (
//                         <motion.div
//                             key={feature.title}
//                             initial={{ opacity: 0, y: 50 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.2, duration: 0.6 }}
//                             onMouseEnter={() => setHoveredFeature(index)}
//                             onMouseLeave={() => setHoveredFeature(null)}
//                             className={`p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 ${hoveredFeature === index
//                                 ? 'scale-105 shadow-2xl border-2 border-blue-300'
//                                 : ''
//                                 }`}
//                         >
//                             <div className="text-5xl mb-6 text-blue-500 flex justify-center">
//                                 {feature.icon}
//                             </div>
//                             <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
//                                 {feature.title}
//                             </h3>
//                             <p className="text-gray-600 dark:text-gray-300">
//                                 {feature.description}
//                             </p>
//                         </motion.div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Home;
