import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MdGavel } from "react-icons/md";
import { FaFire, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { Link } from "react-router-dom";
import Spinner from "../custom-components/Spinner";

const calculateTimeLeft = (endTime) => {
  const difference = new Date(endTime) - new Date();
  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  return "Ended";
};

const calculateInitialTimeLeft = (auctions) => {
  const timeLeftObj = {};
  auctions.forEach((auction) => {
    timeLeftObj[auction._id] = {
      start: calculateTimeLeft(auction.startTime),
      end: calculateTimeLeft(auction.endTime),
    };
  });
  return timeLeftObj;
};

const Auctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  const [timeLeft, setTimeLeft] = useState({});

  // Initialize timeLeft as soon as allAuctions is available
  useEffect(() => {
    if (allAuctions.length > 0) {
      setTimeLeft(calculateInitialTimeLeft(allAuctions));
    }
  }, [allAuctions]);

  // Update timeLeft every second
  useEffect(() => {
    if (allAuctions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateInitialTimeLeft(allAuctions));
    }, 1000);

    return () => clearInterval(timer);
  }, [allAuctions]);

  const liveAuctionsCount = allAuctions.filter(
    (auction) =>
      timeLeft[auction._id]?.start === "Ended" &&
      timeLeft[auction._id]?.end !== "Ended"
  ).length;

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
                  <span className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 mr-4">
                    <MdGavel className="w-8 h-8" />
                  </span>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      Entire Auctions Inventory
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Discover unique items and place your bids
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
                    <FaFire className="w-4 h-4 mr-2" />
                    {liveAuctionsCount} Active Auctions
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {allAuctions.map((auction, index) => (
                <Link
                  key={auction._id}
                  to={`/auction/item/${auction._id}`}
                  className="flex-grow basis-full bg-white dark:bg-gray-800/50 rounded-3xl group hover:border-purple-500 dark:hover:border-purple-500/50 hover:shadow-purple-500/10 border border-gray-100 dark:border-gray-700"
                >
                  <div className="relative p-6 overflow-hidden">
                    <div className="flex flex-col items-start gap-4 relative h-full">
                      <div className="group relative w-full overflow-hidden rounded-2xl aspect-video">
                        <span
                          className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center
                                                    rounded-full bg-gradient-to-br from-blue-200 via-pink-200 to-yellow-200
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
                        {timeLeft[auction._id]?.end === "Ended" ? (
                          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-200 dark:border-red-800">
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold mb-2">
                              <FaCheckCircle className="w-5 h-5" />
                              Auction Completed
                            </div>
                            <p className="text-red-600/80 dark:text-red-400/80 text-sm">
                              This auction has ended. Thank you for your
                              interest!
                            </p>
                            <p className="text-red-600/80 dark:text-red-400/80 text-sm">
                              Winner Determined!
                            </p>
                          </div>
                        ) : timeLeft[auction._id]?.start === "Ended" ? (
                          <>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-200 dark:border-green-800">
                              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold mb-2">
                                <FaFire className="w-5 h-5" />
                                Live Auction
                              </div>
                              <p className="text-green-600/80 dark:text-green-400/80 text-sm">
                                Don't miss out! Place your bids now.
                              </p>
                            </div>
                            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-600 dark:text-gray-300">
                                  Current Bid
                                </span>
                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                  $ {auction.startingBid}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300">
                                  Ends In
                                </span>
                                <span className="text-red-500 font-semibold">
                                  {timeLeft[auction._id]?.end}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-2">
                                <FaHourglassHalf className="w-5 h-5" />
                                Upcoming Auction
                              </div>
                              <p className="text-blue-600/80 dark:text-blue-400/80 text-sm">
                                Get ready! This auction will start soon.
                              </p>
                            </div>
                            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-3 backdrop-blur-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300">
                                  Starting Bid
                                </span>
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                  $ {auction.startingBid}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300">
                                  Starts In
                                </span>
                                <span className="text-blue-500 font-semibold">
                                  {timeLeft[auction._id]?.start}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      )}
    </>
  );
};

export default Auctions;
